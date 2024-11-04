using Microsoft.EntityFrameworkCore;
using OrderManagementApp.Data;
using OrderManagementApp.Models.Entities;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace OrderManagementApp.Services
{
    public class BookService
    {
        private readonly OrderManagementDB _context;
        private readonly HttpClient _httpClient;

        public BookService(OrderManagementDB context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }


        public async Task<Book> AddBookAsync(Book book)
        {
            book.Id = 0;

            var existingBook = await _context.Books
                .FirstOrDefaultAsync(b => b.ISBN == book.ISBN);

            if (existingBook != null)
            {
                existingBook.Stock  += book.Stock ;
                _context.Books.Update(existingBook);
            }
            else
            {
                _context.Books.Add(book);
            }

            await _context.SaveChangesAsync();

            return existingBook ?? book; 
        }


        public async Task<Book> UpdateBookAsync(Book book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
            return book;
        }


        public async Task<IEnumerable<Book>> SearchBooksAsync(string? isbn, string? title, string? author, int? year)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrWhiteSpace(isbn))
            {
                query = query.Where(b => b.ISBN.Contains(isbn));
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                query = query.Where(b => b.Title.Contains(title));
            }

            if (!string.IsNullOrWhiteSpace(author))
            {
                query = query.Where(b => b.Authors.Any(a => a == author));
            }

            if (year.HasValue)
            {
                query = query.Where(b => b.Year == year.Value);
            }

            return await query.ToListAsync();
        }


        public async Task<Book> SearchBookByIsbnAsync(string isbn)
        {
            var response = await _httpClient.GetAsync($"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(json);

                var items = jsonObject["items"];
                if (items != null && items.HasValues)
                {
                    var volumeInfo = items[0]["volumeInfo"];

                    var book = new Book
                    {
                        ISBN = isbn,
                        Title = volumeInfo["title"]?.ToString(),
                        Authors = volumeInfo["authors"]?.Select(a => a.ToString()).ToList() ?? new List<string>(),
                        Year = int.TryParse(volumeInfo["publishedDate"]?.ToString().Substring(0, 4), out int year) ? year : 0
                    };

                    return book;
                }
            }

            return null;
        }
    }
}
