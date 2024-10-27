namespace OrderManagementApp.Models.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; } 
        public Customer? Customer { get; set; }
        public DateTime OrderDate { get; set; } 
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public decimal TotalPrice { get; set; }
    }
}
