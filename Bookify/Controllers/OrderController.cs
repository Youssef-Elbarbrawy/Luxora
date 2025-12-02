using Bookify.DataAccessLayer.DTOs;
using Bookify.Service;
using Bookify.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bookify.Controllers
{
    public class OrderController : Controller
    {
        private readonly OrdersService _orderService;

        public OrderController(OrdersService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public IActionResult MakeOrder()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> MakeOrder(OrderRequestDTO dto)
        {
            int? loggedInUserId = null;

            var orderId = await _orderService.MakeOrderAsync(dto, loggedInUserId);

            ViewBag.OrderId = orderId;

            return View("Success");
        }
    }

}
