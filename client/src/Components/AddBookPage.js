import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBookPage.css';

const AddBookPage = () => {
    const [book, setBook] = useState({
        isbn: '',
        title: '',
        authors: '',
        year: '',
        price: '',
        stock: ''
    });
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook((prev) => ({
            ...prev,
            [name]: name === 'authors' ? value : value.trim()
        }));
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        const authorsArray = book.authors.split(',').map(author => author.trim());
    
        const bookToAdd = {
            ISBN: book.isbn,
            Title: book.title,
            Authors: authorsArray,
            Year: parseInt(book.year),
            Price: parseFloat(book.price),
            Stock: parseInt(book.stock),
        };
    
        try {
            const response = await fetch(`${apiUrl}/api/books/addbooks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookToAdd),
            });
    
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(`Failed to add book: ${JSON.stringify(responseData)}`);
            }
    
            const responseData = await response.json();
            console.log("Book added successfully:", responseData);
            navigate('/inventory');
        } catch (error) {
            console.error("Error occurred:", error.message);
            setErrorMessage(error.message);
        }
    };
    

    return (
        <div className="container">
            <button className="back-button" onClick={() => navigate('/inventory')}>Back</button>
            <h1>Add Book</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleAddBook}> 
                <div>
                    <label>ISBN:</label>
                    <input type="text" name="isbn" value={book.isbn} onChange={handleChange} required />
                </div>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={book.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Authors (comma separated):</label>
                    <input type="text" name="authors" value={book.authors} onChange={handleChange} required />
                </div>
                <div>
                    <label>Year:</label>
                    <input type="number" name="year" value={book.year} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" step="0.01" name="price" value={book.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Stock:</label>
                    <input type="number" name="stock" value={book.stock} onChange={handleChange} required />
                </div>
                <button type="submit" className="button">Add Book</button>
            </form>
        </div>
    );
};

export default AddBookPage;
