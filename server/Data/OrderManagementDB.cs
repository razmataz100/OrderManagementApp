using Microsoft.EntityFrameworkCore;
using OrderManagementApp.Models.Entities;

namespace OrderManagementApp.Data
{
    public class OrderManagementDB : DbContext
    {
        public OrderManagementDB(DbContextOptions<OrderManagementDB> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Set Id as primary key and auto-increment
            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => oi.Id); // Single primary key

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Book)
                .WithMany(b => b.OrderItems)
                .HasForeignKey(oi => oi.BookId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<Book>()
                .Property(b => b.Price)
                .HasColumnType("decimal(18,2)"); // Adjust precision and scale as needed

            // Ensure Id is auto-incremented
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Id)
                .ValueGeneratedOnAdd();
        }
    }
}
