
namespace Bookify.DataAccessLayer.DTOs;

public class PaymentDto
{
    public int ReservationId { get; set; }
    public string GuestName { get; set; } = "Guest";
    public string CardNumber { get; set; } = "4111111111111111";
    public string ExpiryDate { get; set; } = "12/30";
    public string CVV { get; set; } = "123";
    public string RoomType { get; set; } = "Standard";
    public decimal TotalAmount { get; set; }
}

