public class OrderDetailsDto
{
    public int OrderId { get; set; }
    public CustomerDTO Customer { get; set; } = new CustomerDTO();
    public DateTime OrderDate { get; set; }
    public decimal TotalPrice { get; set; }
    public List<OrderedBookDto> OrderItems { get; set; } = new List<OrderedBookDto>();
}
