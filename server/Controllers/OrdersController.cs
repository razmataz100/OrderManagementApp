using Microsoft.AspNetCore.Mvc;
using OrderManagementApp.Models.Entities;
using OrderManagementApp.Services;
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
        return Ok("Order created successfully.");
    }
}

}
