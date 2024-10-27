using System;
using System.Collections.Generic;
using System.Linq;
using OrderManagementApp.Data;
using OrderManagementApp.Models.Entities;

public class OrderService
{
    private readonly OrderManagementDB _context;

    public OrderService(OrderManagementDB context)
    {
        _context = context;
    }

    public void AddOrder(CreateOrderDTO createOrderDTO)
    {
        var books = _context.Books.Where(b => createOrderDTO.OrderItems.Select(o => o.BookId).Contains(b.Id)).ToList();

        var orderItems = createOrderDTO.OrderItems.Select(bookOrderDTO =>
        {
            var book = books.First(b => b.Id == bookOrderDTO.BookId);

            return new OrderItem
            {
                BookId = bookOrderDTO.BookId,
                Quantity = bookOrderDTO.Quantity,
                TotalPrice = bookOrderDTO.Quantity * book.Price
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

        foreach (var bookOrder in createOrderDTO.OrderItems)
        {
            var book = books.First(b => b.Id == bookOrder.BookId);
            book.Stock -= bookOrder.Quantity;
        }

        _context.SaveChanges();
    }
}
