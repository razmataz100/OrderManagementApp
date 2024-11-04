import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InventoryPage.css';

const InventoryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ isbn: '', title: '', author: '', year: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const apiUrl = "http://localhost:5046";

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/books/search`); 
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      console.log(data); 
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${apiUrl}/api/books/search?${query}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBooks(data);
      setMessage(data.length ? '' : 'No books found.');
    } catch (error) {
      console.error("Failed to search books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    navigate('/add-book'); 
  };

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      <h1>Inventory</h1>
      {message && <p className="message">{message}</p>}
      <div className="search-container">
        <input type="text" placeholder="ISBN" value={searchParams.isbn} onChange={(e) => setSearchParams({ ...searchParams, isbn: e.target.value })} />
        <input type="text" placeholder="Title" value={searchParams.title} onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })} />
        <input type="text" placeholder="Author" value={searchParams.author} onChange={(e) => setSearchParams({ ...searchParams, author: e.target.value })} />
        <input type="number" placeholder="Year" value={searchParams.year} onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })} />
        <button className="button" onClick={handleSearch}>Search</button>
      </div>
      <div className="scrollable-box">
      <ul>
        {books.map((book) => (
            <li key={book.id}>
            <strong>Title:</strong> {book.title} <br />
            <strong>ISBN:</strong> {book.isbn} <br />
            <strong>Authors:</strong> {book.authors.join(', ')} <br />
            <strong>Year:</strong> {book.year} <br />
            <strong>Price:</strong> ${book.price.toFixed(2)} <br />
            <strong>Stock:</strong> {book.stock} <br />
            </li>
        ))}
    </ul>
      </div>
      <div className="button-container">
        <button className="button" onClick={handleAddBook}>Add Book</button>
      </div>
    </div>
  );
};

export default InventoryPage;
