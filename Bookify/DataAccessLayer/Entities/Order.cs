using System.ComponentModel.DataAnnotations;

namespace Bookify.DataAccessLayer.Entities
{
    public class OrderService
    {
        public int OrderId { get; set; }
        public Order order { get; set; }
        public int ServiceId { get; set; }
        public AdditionalService service { get; set; }
    }
    public class AdditionalService
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal price { get; set; }
        public ICollection<OrderService> OrderServices { get; set; } = new List<OrderService>();

    }
    public class BookingInfo
    {
        public int Id { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int NoOfGuests { get; set; }
        public int NoOfChilds { get; set; }
        public int RoomTypeId { get; set; }
        public Room RoomType { get; set; }
        public int NumOfRooms { get; set; }
        public int OrderId { get; set; }
        public Order order { get; set; }
    }
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int CustomerId { get; set; }
        public Customer customer { get; set; }


        public BookingInfo bookingInfo { get; set; }


        public ICollection<OrderService> additionalServices { get; set; } = null!;
        public string specialRequests { get; set; } = null!;


        public Payment payment { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
