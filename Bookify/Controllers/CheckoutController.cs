using Bookify.DataAccessLayer;
using Bookify.DataAccessLayer.DTOs;
using Bookify.DataAccessLayer.Entities;
using Bookify.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookify.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly BookifyDbContext _context;

        public CheckoutController(BookifyDbContext context)
        {
            _context = context;
        }

        private int? GetCurrentUserId()
        {
            return SessionHelper.GetUserId(HttpContext.Session);
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            if (!SessionHelper.IsLoggedIn(HttpContext.Session))
            {
                return RedirectToAction("Login", "Auth");
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            // Get cart items
            var cartItems = await _context.CartItems
                .Include(c => c.Room)
                .ThenInclude(r => r.RoomType)
                .Where(c => c.UserId == userId.Value)
                .ToListAsync();

            if (!cartItems.Any())
            {
                TempData["Error"] = "Your cart is empty. Please add rooms before checkout.";
                return RedirectToAction("Index", "Cart");
            }

            // Prepare DTO for the view
            var model = new CheckoutDTO
            {
                CheckIn = DateTime.Today.AddDays(1),
                CheckOut = DateTime.Today.AddDays(2),
                NoOfGuests = 1,
                NoOfChildren = 0,
                CartItems = cartItems.Select(c => new CartItemDTO
                {
                    RoomNumber = c.RoomNumber,
                    RoomName = c.Room.RoomName,
                    RoomType = c.Room.RoomType?.TypeName ?? "Standard",
                    PricePerNight = c.Room.Price,
                    ImageUrl = c.Room.ImageUrl,
                    Capacity = c.Room.Capacity
                }).ToList(),
                TotalNights = 1,
                TotalPrice = cartItems.Sum(c => c.Room.Price)
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ProcessCheckout(CheckoutDTO model)
        {
            if (!SessionHelper.IsLoggedIn(HttpContext.Session))
            {
                return RedirectToAction("Login", "Auth");
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            // Validate dates
            if (model.CheckIn < DateTime.Today)
            {
                ModelState.AddModelError("CheckIn", "Check-in date cannot be in the past");
            }
            if (model.CheckOut <= model.CheckIn)
            {
                ModelState.AddModelError("CheckOut", "Check-out date must be after check-in date");
            }

            // Get cart items
            var cartItems = await _context.CartItems
                .Include(c => c.Room)
                .ThenInclude(r => r.RoomType)
                .Where(c => c.UserId == userId.Value)
                .ToListAsync();

            if (!cartItems.Any())
            {
                TempData["Error"] = "Your cart is empty.";
                return RedirectToAction("Index", "Cart");
            }

            // Reload cart items for the view if validation fails
            model.CartItems = cartItems.Select(c => new CartItemDTO
            {
                RoomNumber = c.RoomNumber,
                RoomName = c.Room.RoomName,
                RoomType = c.Room.RoomType?.TypeName ?? "Standard",
                PricePerNight = c.Room.Price,
                ImageUrl = c.Room.ImageUrl,
                Capacity = c.Room.Capacity
            }).ToList();

            if (!ModelState.IsValid)
            {
                return View("Index", model);
            }

            try
            {
                // Calculate total nights and price
                var totalNights = (model.CheckOut - model.CheckIn).Days;
                var totalPrice = cartItems.Sum(c => c.Room.Price) * totalNights;

                // 1. Create Order
                var order = new Order
                {
                    CustomerId = userId.Value,
                    specialRequests = model.SpecialRequests ?? "",
                    TotalPrice = totalPrice
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // 2. Create BookingInfo (using first room's number for RoomTypeId - this is a workaround)
                var bookingInfo = new BookingInfo
                {
                    CheckIn = model.CheckIn,
                    CheckOut = model.CheckOut,
                    NoOfGuests = model.NoOfGuests,
                    NoOfChilds = model.NoOfChildren,
                    NumOfRooms = cartItems.Count,
                    RoomTypeId = cartItems.First().RoomNumber, // References the room
                    OrderId = order.Id
                };

                _context.BookingInfos.Add(bookingInfo);
                await _context.SaveChangesAsync();

                // 3. Create Reservations for each room in cart
                var reservationsCreated = new List<int>();
                foreach (var cartItem in cartItems)
                {
                    // Check room availability for the selected dates
                    var isRoomBooked = await _context.Reservations
                        .AnyAsync(r => r.RoomNumber == cartItem.RoomNumber &&
                                      r.Status != ReservationStatus.Cancelled &&
                                      ((model.CheckIn >= r.StartDate && model.CheckIn < r.EndDate) ||
                                       (model.CheckOut > r.StartDate && model.CheckOut <= r.EndDate) ||
                                       (model.CheckIn <= r.StartDate && model.CheckOut >= r.EndDate)));

                    if (isRoomBooked)
                    {
                        TempData["Error"] = $"Room {cartItem.Room.RoomName} is not available for the selected dates.";
                        return View("Index", model);
                    }

                    var reservation = new Reservation
                    {
                        CustomerId = userId.Value,
                        RoomNumber = cartItem.RoomNumber,
                        StartDate = model.CheckIn,
                        EndDate = model.CheckOut,
                        ReservationDate = DateTime.Now,
                        Price = cartItem.Room.Price * totalNights,
                        Status = ReservationStatus.Pending
                    };

                    _context.Reservations.Add(reservation);
                    await _context.SaveChangesAsync();
                    reservationsCreated.Add(reservation.ReservationId);

                    // Update room status
                    cartItem.Room.Status = "Unavailable";
                    _context.Rooms.Update(cartItem.Room);
                }

                // 4. Create Payment linked to Order
                var payment = new Payment
                {
                    OrderId = order.Id,
                    ReservationId = reservationsCreated.First(), // Link to first reservation
                    TotalAmount = totalPrice
                };

                _context.Payments.Add(payment);

                // 5. Clear the cart
                _context.CartItems.RemoveRange(cartItems);

                await _context.SaveChangesAsync();

                // Store order info for payment page
                TempData["OrderId"] = order.Id;
                TempData["TotalAmount"] = totalPrice.ToString("F2");
                TempData["ReservationIds"] = string.Join(",", reservationsCreated);

                // Redirect to payment or success
                TempData["Success"] = $"Booking confirmed! Order #{order.Id} created with {reservationsCreated.Count} room(s).";
                
                // Redirect to payment for the first reservation (or could create a combined payment page)
                return RedirectToAction("Payment", "Payment", new { reservationId = reservationsCreated.First() });
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"An error occurred: {ex.Message}";
                return View("Index", model);
            }
        }

        [HttpGet]
        public async Task<IActionResult> CalculatePrice(DateTime checkIn, DateTime checkOut)
        {
            if (!SessionHelper.IsLoggedIn(HttpContext.Session))
            {
                return Json(new { success = false });
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Json(new { success = false });
            }

            var cartItems = await _context.CartItems
                .Include(c => c.Room)
                .Where(c => c.UserId == userId.Value)
                .ToListAsync();

            if (!cartItems.Any())
            {
                return Json(new { success = false });
            }

            var totalNights = (checkOut - checkIn).Days;
            if (totalNights <= 0)
            {
                return Json(new { success = false });
            }

            var pricePerNight = cartItems.Sum(c => c.Room.Price);
            var totalPrice = pricePerNight * totalNights;

            return Json(new
            {
                success = true,
                totalNights = totalNights,
                pricePerNight = pricePerNight,
                totalPrice = totalPrice
            });
        }
    }
}





