using Bookify.DataAccessLayer.DTOs;
using Bookify.DataAccessLayer.Entities;
using Bookify.DataAccessLayer;
using Microsoft.EntityFrameworkCore;

namespace Bookify.Service
{
    public interface IOrdersService
    {
        Task<int> MakeOrderAsync(OrderRequestDTO dto);
    }
    public class OrdersService : IOrdersService
    {
        private readonly BookifyDbContext _context;

        public OrdersService(BookifyDbContext context)
        {
            _context = context;
        }

        public async Task<int> MakeOrderAsync(OrderRequestDTO dto)
        {
            // 1) Add customer
            var customer = new Customer
            {
                Name = dto.Customer.FullName,
                Email = dto.Customer.Email,
                phoneNumber = dto.Customer.PhoneNumber,
                nationality = dto.Customer.Nationality,
                SSN = dto.Customer.NationalID // for natioality
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var order = new Order
            {
                CustomerId = customer.CustomerId,
                specialRequests = dto.SpecialRequests,

            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // 3) create booking info
            var booking = new BookingInfo
            {
                CheckIn = dto.BookingInfo.CheckIn,
                CheckOut = dto.BookingInfo.CheckOut,
                NoOfGuests = dto.BookingInfo.NoOfGuests,
                NoOfChilds = dto.BookingInfo.NoOfChilds,
                NumOfRooms = dto.BookingInfo.NumOfRooms,
                RoomTypeId = dto.BookingInfo.RoomTypeId,
                OrderId = order.Id
            };

            _context.BookingInfos.Add(booking);
            await _context.SaveChangesAsync();
            // 4) Add services
            if (dto.AdditionalServiceIds != null)
            {
                foreach (var serviceId in dto.AdditionalServiceIds)
                {
                    _context.OrderServices.Add(new OrderService
                    {
                        OrderId = order.Id,
                        ServiceId = serviceId
                    });
                }
            }

            // 5) Create payment
            var room = await _context.Rooms.FindAsync(dto.BookingInfo.RoomTypeId);
            decimal basePrice = room.Price * (decimal)(dto.BookingInfo.CheckOut - dto.BookingInfo.CheckIn).TotalDays;

            decimal servicesPrice = 0;
            if (dto.AdditionalServiceIds != null)
            {
                var services = await _context.Services
                    .Where(s => dto.AdditionalServiceIds.Contains(s.Id))
                    .ToListAsync();

                servicesPrice = services.Sum(s => s.price);
            }

            order.TotalPrice = basePrice + servicesPrice;

            var payment = new Payment
            {
                OrderId = order.Id,

                amount = order.TotalPrice
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // 6) Return Order Id
            return order.Id;
        }
    }
}
