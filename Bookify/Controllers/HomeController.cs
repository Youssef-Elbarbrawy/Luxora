using System.Diagnostics;
using Bookify.DataAccessLayer;
using Bookify.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookify.Controllers
{
    public class HomeController : Controller
    {
        private readonly BookifyDbContext _context;

        public HomeController(BookifyDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var rooms = await _context.Rooms
                .Include(r => r.RoomType)
                .Where(r => r.Status == "Available")
                .OrderBy(r => r.Price)
                .ToListAsync();

            return View(rooms);
        }
    }
}
