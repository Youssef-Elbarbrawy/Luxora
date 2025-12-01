using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bookify.DataAccessLayer.Entities;


public class Payment
{
    [Key]
    public int PaymentId { get; set; }
    [Required]
    public int ReservationId { get; set; }

    [Required]
    [Display(Name = "Guest Name")]
    public string GuestName { get; set; }

    [Required]
    [Display(Name = "Card Number")]
    [CreditCard]
    public string CardNumber { get; set; }

    [Required]
    [Display(Name = "Expiry Date")]
    [RegularExpression(@"^(0[1-9]|1[0-2])\/?([0-9]{2})$",
        ErrorMessage = "Format must be MM/YY")]
    public string ExpiryDate { get; set; }
    public Reservation Reservation { get; set; }
    public Order Order { get; set; }
    [ForeignKey("OrderId")]
    public int OrderId { get; set; }

    [Required]
    [StringLength(4, MinimumLength = 3)]
    public string CVV { get; set; }

    public string RoomType { get; set; }
    public decimal TotalAmount { get; set; }
}