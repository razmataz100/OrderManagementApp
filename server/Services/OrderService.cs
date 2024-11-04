using OrderManagementApp.Data;
using OrderManagementApp.Models.Entities;
using Microsoft.EntityFrameworkCore;

public class OrderService
{
    private readonly OrderManagementDB _context;

    public OrderService(OrderManagementDB context)
    {
        _context = context;
    }

    public void AddOrder(CreateOrderDTO createOrderDTO)
    {
        var books = _context.Books
            .Where(b => createOrderDTO.OrderItems.Select(o => o.BookId).Contains(b.Id))
            .ToList();

        var orderItems = createOrderDTO.OrderItems.Select(orderItem =>
        {
            var book = books.First(b => b.Id == orderItem.BookId);

            return new OrderItem
            {
                BookId = orderItem.BookId,
                Quantity = orderItem.Quantity,
                TotalPrice = orderItem.Quantity * book.Price
            };
        }).ToList();

        var totalPrice = orderItems.Sum(item => item.TotalPrice); 

        if (createOrderDTO.CustomerId.HasValue)
        {
            totalPrice *= 0.90m; 
        }

        var order = new Order
        {
            OrderDate = DateTime.UtcNow,
            CustomerId = createOrderDTO.CustomerId,
            OrderItems = orderItems, 
            TotalPrice = totalPrice 
        };

        _context.Orders.Add(order);

        foreach (var orderItem in createOrderDTO.OrderItems)
        {
            var book = books.First(b => b.Id == orderItem.BookId);
            book.Stock -= orderItem.Quantity;
        }

        _context.SaveChanges();
    }




    public async Task<IEnumerable<Order>> GetOrdersAsync(string? email, string? name)
    {
        var query = _context.Orders.AsQueryable();

        if (!string.IsNullOrEmpty(email))
        {
            query = query.Where(o => o.Customer.Email.Contains(email));
        }

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(o => o.Customer.Name.Contains(name));
        }

        return await query.ToListAsync(); 
    }

 public async Task<IEnumerable<OrderDetailsDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .ToListAsync();

        var orderDTOs = orders.Select(order => new OrderDetailsDto
        {
            OrderId = order.Id,
            OrderDate = order.OrderDate,
            TotalPrice = order.TotalPrice,
            Customer = new CustomerDTO
            {
                Name = order.Customer?.Name,
                Email = order.Customer?.Email
            },
            OrderItems = order.OrderItems.Select(item => new OrderedBookDto
            {
                BookId = item.BookId,
                BookTitle = item.Book.Title,
                Quantity = item.Quantity
            }).ToList()
        }).ToList();

        return orderDTOs;
    }

    public async Task<List<OrderDetailsDto>> GetOrdersByCustomerAsync(int customerId)
{

    var orders = await _context.Orders
        .Where(o => o.CustomerId == customerId)
        .Select(o => new OrderDetailsDto
        {
            OrderId = o.Id,
            Customer = new CustomerDTO 
            { 
                Name = o.Customer.Name, 
                Email = o.Customer.Email 
            },
            OrderDate = o.OrderDate,
            TotalPrice = o.TotalPrice,
            OrderItems = o.OrderItems.Select(oi => new OrderedBookDto
            {
                BookTitle = oi.Book.Title,
                Quantity = oi.Quantity
            }).ToList()
        }).ToListAsync();

    return orders;
}






}
