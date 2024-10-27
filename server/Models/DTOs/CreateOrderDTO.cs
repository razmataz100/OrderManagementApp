public class CreateOrderDTO
{
    public int? CustomerId { get; set; }
    public List<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();
}
