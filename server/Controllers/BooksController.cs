using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OrderManagementApp.Models.Entities;
using OrderManagementApp.Services;

namespace OrderManagementApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookService _bookService;

        public BooksController(BookService bookService)
        {
            _bookService = bookService;
        }

        [HttpPost("addbooks")]
        public async Task<ActionResult<Book>> AddBooks([FromBody] Book book)
        {
            if (book == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var addedBook = await _bookService.AddBookAsync(book);
            
            return CreatedAtAction(nameof(AddBooks), addedBook);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Book>>> SearchBooks(string? isbn, string? title, string? author, int? year)
        {
            var books = await _bookService.SearchBooksAsync(isbn, title, author, year);
            return books.Any() ? Ok(books) : NotFound("No books found.");
        }

        [HttpGet("search-isbn/{isbn}")]
        public async Task<ActionResult<Book>> SearchBookByIsbn(string isbn)
        {
            var book = await _bookService.SearchBookByIsbnAsync(isbn);
            return book != null ? Ok(book) : NotFound("Book not found.");
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("Controller is working!");
        }
    }
}
