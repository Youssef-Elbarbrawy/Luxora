using System.ComponentModel.DataAnnotations;

namespace Bookify.DataAccessLayer.DTOs
{
    public class CheckoutDTO
    {
        [Required(ErrorMessage = "Check-in date is required")]
        [Display(Name = "Check-in Date")]
        [DataType(DataType.Date)]
        public DateTime CheckIn { get; set; }

        [Required(ErrorMessage = "Check-out date is required")]
        [Display(Name = "Check-out Date")]
        [DataType(DataType.Date)]
        public DateTime CheckOut { get; set; }

        [Required(ErrorMessage = "Number of guests is required")]
        [Range(1, 20, ErrorMessage = "Guests must be between 1 and 20")]
        [Display(Name = "Number of Adults")]
        public int NoOfGuests { get; set; } = 1;

        [Range(0, 10, ErrorMessage = "Children must be between 0 and 10")]
        [Display(Name = "Number of Children")]
        public int NoOfChildren { get; set; } = 0;

        [MaxLength(500)]
        [Display(Name = "Special Requests")]
        public string? SpecialRequests { get; set; }

        // For displaying in the view
        public List<CartItemDTO>? CartItems { get; set; }
        public decimal TotalPrice { get; set; }
        public int TotalNights { get; set; }
    }

    public class CartItemDTO
    {
        public int RoomNumber { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int Capacity { get; set; }
    }
}





