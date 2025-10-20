using System.Text.RegularExpressions;
using Bookify.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/chat")]
[ApiController]
public class BotController : ControllerBase
{
    private List<Room> hotelRooms = HotelRooms.Rooms;

    [HttpPost("send")]
    public IActionResult SendMessage([FromBody] ChatMessage message)
    {
        string reply = "";
        string input = message.Text.ToLower();

        if (input == "hi")
        {
            reply = "Hi there!<br/>How can I help you?<br/>";
            return Ok(new { reply });
        }
        else if (input == "bye")
        {
            reply = "See you later!<br/>";
            return Ok(new { reply });
        }

        // Available room types (match with Category)
        var roomTypes = new List<string>
        {
            "deluxe",
            "luxury",
            "standard",
            "family"
        };

        // 1. Detect if user specified a room type
        string selectedType = roomTypes.FirstOrDefault(rt => input.Contains(rt));

        if (!string.IsNullOrEmpty(selectedType))
        {
            reply += $"You’re looking for a {selectedType} room, right?<br>";
        }

        // 2. Detect if user specified a number (budget)
        int? budget = null;
        var numbers = Regex.Matches(input, @"\d+");
        if (numbers.Count > 0)
        {
            budget = int.Parse(numbers[0].Value);
        }

        // 3. Build query using in-memory list
        IEnumerable<Room> query = Enumerable.Empty<Room>();

        if (!string.IsNullOrEmpty(selectedType))
        {
            query = HotelRooms.Rooms.Where(r =>
                !string.IsNullOrEmpty(r.Category) &&
                Regex.IsMatch(r.Category, $@"\b{Regex.Escape(selectedType)}\b", RegexOptions.IgnoreCase));

            if (budget.HasValue)
                query = query.OrderBy(r => Math.Abs((double)r.Price - budget.Value));
        }
        else
        {
            if (budget.HasValue)
            {
                query = HotelRooms.Rooms;
                query = query.OrderBy(r => Math.Abs((double)r.Price - budget.Value));
            }
        }

        var rooms = query.Take(5).ToList();

        // 4. Build reply
        if (rooms.Any())
        {
            if (!string.IsNullOrEmpty(selectedType) && budget.HasValue)
                reply += $"Here are {selectedType} rooms closest to your budget of ${budget}:<br><br>";
            else if (!string.IsNullOrEmpty(selectedType))
                reply += $"Here are our available {selectedType} rooms:<br><br>";
            else if (budget.HasValue)
                reply += $"Here are rooms closest to your budget of ${budget}:<br><br>";
            else
                reply += $"Here are some of our available rooms:<br><br>";

            foreach (var room in rooms)
            {
                reply += $@"
                    <b>{room.Name}</b> ({room.Category})<br>
                    Price: ${room.Price}<br>
                    {room.Description}<br>
                    {room.Perks}<br>
                    👉 <a href='{room.Image}' target='_blank'>View Room</a><br><br>";
            }
        }

        if (reply == "") reply = "Sorry, I didn’t understand your request. Could you please clarify?";
        else reply += "Is there anything else I can help you with?";

        return Ok(new { reply });
    }
}

public class ChatMessage
{
    public string Text { get; set; }
}
