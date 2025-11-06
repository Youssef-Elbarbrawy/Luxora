using System.Net.NetworkInformation;
using System.Text.RegularExpressions;
using Bookify.DataAccessLayer;
using Bookify.DataAccessLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookify.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class BotController : ControllerBase
    {
        private readonly BookifyDbContext _context;

        public BotController(BookifyDbContext context)
        {
            _context = context;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] BotRequest request)
        {
            string userMessage = request.Message?.ToLower().Trim() ?? "";
            string reply = "I'm sorry, I didn't understand that. Can you please rephrase?";

            // Handle greetings
            if (Regex.IsMatch(userMessage, @"\b(hi|hello|hey|good morning|good evening)\b"))
            {
                reply = "👋 Hello! Welcome to Bookify. How can I assist you today?";
            }

            // Handle asking for available rooms
            else if (userMessage.Contains("available") && userMessage.Contains("room"))
            {
                var rooms = await _context.Rooms
                .Include(r => r.RoomType)
                    .Where(r => r.Status == "Available")
                    .ToListAsync();

                if (rooms.Any())
                {
                    reply = "🏨 Here are some available rooms:<br><br>";
                    foreach (var room in rooms)
                    {
                        string imageUrl = !string.IsNullOrEmpty(room.ImageUrl)
                            ? room.ImageUrl
                            : "https://via.placeholder.com/600x400?text=No+Image";

                        reply += $@"
                            <b>Room {room.RoomNumber}</b> ({room.RoomType?.TypeName})<br>
                            💰 Price: ${room.Price}<br>
                            🏷️ {room.Description}<br>
                            👉 <a href='{imageUrl}' target='_blank'>View Room</a><br><br>";
                    }
                }
                else
                {
                    reply = "😔 Sorry, there are no available rooms at the moment.";
                }
            }

            // Handle filtering by type
            else if (userMessage.Contains("room type") || userMessage.Contains("type"))
            {
                var types = await _context.RoomTypes.Select(t => t.TypeName).ToListAsync();
                reply = "🏷️ Available room types:<br>" + string.Join("<br>", types);
            }

            // Handle request for specific type (e.g., "show deluxe rooms")
            else if (userMessage.Contains("show") && userMessage.Contains("room"))
            {
                string selectedType = _context.RoomTypes
                    .Select(t => t.TypeName.ToLower())
                    .FirstOrDefault(t => userMessage.Contains(t));

                if (selectedType != null)
                {
                    var rooms = await _context.Rooms
                        .Include(r => r.RoomType)
                        .Where(r => r.RoomType.TypeName.ToLower().Contains(selectedType))
                        .ToListAsync();

                    if (rooms.Any())
                    {
                        reply = $"🏨 Available {selectedType} rooms:<br><br>";
                        foreach (var room in rooms)
                        {
                            string imageUrl = !string.IsNullOrEmpty(room.ImageUrl)
                                ? room.ImageUrl
                                : "https://via.placeholder.com/600x400?text=No+Image";

                            reply += $@"
                                <b>Room {room.RoomNumber}</b> ({room.RoomType?.TypeName})<br>
                                💰 Price: ${room.Price}<br>
                                🏷️ {room.Description}<br>
                                👉 <a href='{imageUrl}' target='_blank'>View Room</a><br><br>";
                        }
                    }
                    else
                    {
                        reply = $"😔 Sorry, no {selectedType} rooms are available right now.";
                    }
                }
                else
                {
                    reply = "❓ Please specify a valid room type.";
                }
            }

            return Ok(new { reply });
        }
    }

    public class BotRequest
    {
        public string Message { get; set; }
    }
}
