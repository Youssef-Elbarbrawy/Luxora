namespace Bookify.DataAccessLayer.DTOs
{
    public class BookingInfoDTO
    {
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int NoOfGuests { get; set; }
        public int NoOfChilds { get; set; }
        public int NumOfRooms { get; set; }
        public int RoomTypeId { get; set; }
    }
}
