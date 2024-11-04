import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCustomerPage.css';

const RegisterCustomerPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:5046";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setMessage('Name and email are required.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/customers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register customer.');
      }

      const data = await response.json();
      setMessage(`Successfully added customer: ${data.name}`);
      setIsSuccess(true); 
      setName(''); 
      setEmail('');

    } catch (error) {
      console.error("Failed to register customer:", error);
      setMessage(error.message || 'Failed to register customer.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate('/customers')}>Back</button>
      <h1>Register Customer</h1>
      {message && <p className={`message ${isSuccess ? 'success' : 'error'}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterCustomerPage;
