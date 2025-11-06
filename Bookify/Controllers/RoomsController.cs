using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bookify.DataAccessLayer.Entities;
using Bookify.DataAccessLayer;

namespace Bookify.Controllers
{
    public class RoomsController : Controller
    {
        private readonly BookifyDbContext _context;

        public RoomsController(BookifyDbContext context)
        {
            _context = context;
        }

        // Returns the main view with rooms list
        public async Task<IActionResult> Index()
        {
            var rooms = await _context.Rooms
                .Include(r => r.RoomType)
                .ToListAsync();

            return View(rooms);
        }

        // API endpoint: returns JSON for front-end
        [HttpGet]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _context.Rooms
                .Include(r => r.RoomType)
                .Select(r => new
                {
                    //Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomName = r.RoomName,
                    Price = r.Price,
                    Status = r.Status,
                    Capacity = r.Capacity,
                    Size = r.Size,
                    BedType = r.BedType,
                    View = r.View,
                    Amenities = r.Amenities,
                    ImageUrl = r.ImageUrl,
                    Description = r.Description,
                    Type = r.RoomType.TypeName
                    //Featured = r.Featured,
                    //Premium = r.Premium
                })
                .ToListAsync();

            return Ok(rooms);
        }
    }
}