using Microsoft.AspNetCore.Mvc;
using Bookify.Models;
namespace Bookify.Controllers
{
    public class RoomsController : Controller
    {
        public IActionResult MakeOrder()
        {
            return View();
        }

        public IActionResult Terms()
        {
            return View();
        }
        public IActionResult Index()
        {
            var rooms = new List<Room>
            {
                new Room { Id = 1, Name = "Deluxe Room", Description = "Elegant interiors with cozy comfort.", Perks = "🍽 Free Breakfast • 🌐 WiFi • 🛏 King Bed", Price = 120, Image = "/img/Rooms/a.jpg", Category = "Luxury" },
                new Room { Id = 2, Name = "Executive Suite", Description = "Private living area with panoramic views.", Perks = "✨ Spa Access • 🥂 Lounge • 🌇 City View", Price = 200, Image = "/img/Rooms/b.jpg", Category = "Luxury" },
                new Room { Id = 3, Name = "Standard Room", Description = "Affordable yet stylish comfort.", Perks = "🚖 Free Shuttle • ☕ Coffee • 🛋 Cozy Design", Price = 80, Image = "/img/Rooms/c.jpg", Category = "Standard" },
                new Room { Id = 4, Name = "Presidential Suite", Description = "Luxury suite with VIP amenities.", Perks = "🥂 Private Bar • 🎬 Home Theater • 🌆 Skyline View", Price = 500, Image = "/img/Rooms/d.jpg", Category = "Luxury" },
                new Room { Id = 5, Name = "Family Room", Description = "Spacious room perfect for families.", Perks = "🛏 2 King Beds • 🧸 Kids Play Area • 🍳 Breakfast", Price = 180, Image = "/img/Rooms/e.jpg", Category = "Family" },
                new Room { Id = 6, Name = "Honeymoon Suite", Description = "Romantic retreat for couples.", Perks = "🌹 Candlelight Dinner • Jacuzzi • Scenic Balcony", Price = 350, Image = "/img/Rooms/f.jpg", Category = "Luxury" }
            };

            return View(rooms);
        }
    }
}
