using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OrderManagementApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public IActionResult CreateOrder([FromBody] CreateOrderDTO createOrderDTO)
        {
            if (createOrderDTO == null || !createOrderDTO.OrderItems.Any())
            {
                return BadRequest("Invalid order data.");
            }

            _orderService.AddOrder(createOrderDTO);
            return Ok(new { message = "Order created successfully." }); 
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailsDto>>> GetAllOrders() 
        {
            var orderDetails = await _orderService.GetAllOrdersAsync(); 
            return Ok(orderDetails); 
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<OrderDetailsDto>>> GetOrdersByCustomer(int customerId)
        {
            var orders = await _orderService.GetOrdersByCustomerAsync(customerId);
            if (orders == null || !orders.Any())
            {
                return NotFound("No orders found for the specified customer.");
            }
            return Ok(orders);
        }
    }
}
