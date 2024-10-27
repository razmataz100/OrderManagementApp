using Microsoft.EntityFrameworkCore;
using OrderManagementApp.Data;
using OrderManagementApp.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OrderManagementApp.Services
{
    public class CustomerService
    {
        private readonly OrderManagementDB _context;

        public CustomerService(OrderManagementDB context)
        {
            _context = context;
        }

        public async Task<Customer> AddCustomerAsync(Customer customer)
        {
            var existingCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == customer.Email);

            if (existingCustomer != null)
            {
                throw new System.Exception("Email is already in use.");
            }

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<List<Customer>> GetCustomersAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer> GetCustomerByIdAsync(int id)
        {
            return await _context.Customers.Include(c => c.Orders).FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
