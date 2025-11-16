using Bookify.DataAccessLayer.DTOs;
using Bookify.Service;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MakeOrder.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrdersService _orderService;

        public OrderController(OrdersService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("make-order")]
        public async Task<IActionResult> MakeOrder([FromBody] OrderRequestDTO dto)
        {
            var orderId = await _orderService.MakeOrderAsync(dto);
            return Ok(new { OrderId = orderId });
        }


    }
}
