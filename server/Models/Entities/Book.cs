using System.Collections.Generic;

namespace OrderManagementApp.Models.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public string ISBN { get; set; } = string.Empty; 
        public string Title { get; set; } = string.Empty; 
        public List<string> Authors { get; set; } = new List<string>();
        public int Year { get; set; }
        public decimal Price { get; set; } 
        public int Stock { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); 
    }
}
