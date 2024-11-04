import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddOrderPage.css';

const AddOrdersPage = () => {
    const [customerId, setCustomerId] = useState('');
    const [orderItems, setOrderItems] = useState([{ bookId: '', quantity: 1 }]); 
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleChangeCustomerId = (e) => {
        setCustomerId(e.target.value);
    };

    const handleChangeOrderItem = (index, field, value) => {
        const newOrderItems = [...orderItems];
        newOrderItems[index][field] = value;
        setOrderItems(newOrderItems);
    };

    const handleAddOrderItem = () => {
        setOrderItems([...orderItems, { bookId: '', quantity: 1 }]);
    };

    const handleRemoveOrderItem = (index) => {
        const newOrderItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(newOrderItems);
    };

    const handleAddOrder = async (e) => {
      e.preventDefault();
  
      const createOrderDTO = {
          CustomerId: customerId ? parseInt(customerId) : null,
          OrderItems: orderItems.map(item => ({
              BookId: parseInt(item.bookId), 
              Quantity: parseInt(item.quantity)
          }))
      };
  
      try {
        const response = await fetch(`${apiUrl}/api/orders`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(createOrderDTO),
          });
  
          if (response.ok) {
              const jsonResponse = await response.json();
              console.log("Order created successfully:", jsonResponse.message);
              navigate('/orders');
          } else {
              const errorResponse = await response.text();
              throw new Error(errorResponse);
          }
      } catch (error) {
          setErrorMessage(error.message);
      }
  };
  
  

    return (
        <div className="container">
            <button className="back-button" onClick={() => navigate('/orders')}>Back</button>
            <h1>Add Order</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleAddOrder}>
                <div>
                    <label>Customer ID:</label>
                    <input type="text" value={customerId} onChange={handleChangeCustomerId} />
                </div>
                {orderItems.map((item, index) => (
                    <div key={index}>
                        <label>Book ID:</label>
                        <input
                            type="text"
                            value={item.bookId}
                            onChange={(e) => handleChangeOrderItem(index, 'bookId', e.target.value)}
                            required
                        />
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleChangeOrderItem(index, 'quantity', e.target.value)}
                            required
                            min="1"
                        />
                        <button type="button" onClick={() => handleRemoveOrderItem(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddOrderItem}>Add Another Book</button>
                <button type="submit" className="button">Add Order</button>
            </form>
        </div>
    );
};

export default AddOrdersPage;
