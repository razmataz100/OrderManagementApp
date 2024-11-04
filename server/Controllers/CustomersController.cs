using Microsoft.AspNetCore.Mvc;
using OrderManagementApp.Models.Entities;
using OrderManagementApp.Services;


namespace OrderManagementApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomersController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost("add")]
        public async Task<ActionResult<Customer>> AddCustomer([FromBody] CustomerDTO customerDto)
        {
            if (customerDto == null)
            {
                return BadRequest("Customer data is required.");
            }

            if (string.IsNullOrWhiteSpace(customerDto.Name) || string.IsNullOrWhiteSpace(customerDto.Email))
            {
                return BadRequest("Name and Email are required.");
            }

            try
            {
                var customer = new Customer
                {
                    Name = customerDto.Name,
                    Email = customerDto.Email
                };

                var addedCustomer = await _customerService.AddCustomerAsync(customer);
                return CreatedAtAction(nameof(GetCustomerById), new { id = addedCustomer.Id }, addedCustomer);
            }
            catch (System.Exception ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _customerService.GetCustomersAsync();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomerById(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            return customer != null ? Ok(customer) : NotFound("Customer not found.");
        }
    }
}
