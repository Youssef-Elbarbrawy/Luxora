namespace Bookify.DataAccessLayer.DTOs
{
    public class OrderRequestDTO
    {
        public CustomerInfoDTO Customer { get; set; }
        public BookingInfoDTO BookingInfo { get; set; }
        public List<int> AdditionalServiceIds { get; set; }
        public string SpecialRequests { get; set; }
        public int PaymentMethodId { get; set; }
    }
}
