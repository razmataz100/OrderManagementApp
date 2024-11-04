import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL; 

  useEffect(() => {
    fetchOrders(); 
  }, []);

  const fetchOrders = async (searchEmail = '', searchName = '') => {
    try {
      const response = await fetch(`${apiUrl}/api/orders?email=${searchEmail}&name=${searchName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      console.log("Fetched orders:", data);
  
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setMessage(''); 
  };

  const handleNewOrderClick = () => {
    navigate('/add-order'); 
  };

  const handleSearch = () => {
    const filtered = orders.filter(order => 
      (email ? (order.customer.email || '').toLowerCase().includes(email.toLowerCase()) : true) &&
      (name ? (order.customer.name || '').toLowerCase().includes(name.toLowerCase()) : true)
    );
    setFilteredOrders(filtered); 
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      <h1>Orders</h1>
      {message && <p className="message">{message}</p>}

      <div>
        <div className="order-item">
          <input
            type="text"
            placeholder="Search by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="order-item">
          <input
            type="text"
            placeholder="Search by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button className="button" onClick={handleSearch}>Search</button>
      </div>

      <div className="scrollable-box">
      <ul>
      {filteredOrders.map((order) => {
  console.log("Rendering order:", order);
  return (
    <li
      key={order.orderId}
      onClick={() => handleOrderClick(order)}
      style={{
        cursor: 'pointer',
        backgroundColor: selectedOrder?.orderId === order.orderId ? '#f0f0f0' : 'transparent',
      }}
    >
      <div>
        <strong>Customer:</strong> {order.customer.name || "Guest"} <br />
        <strong>Order ID:</strong> {order.orderId} <br /> 
        <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()} <br />
        <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)} <br />
        <strong>Books Ordered:</strong> 
        {order.orderItems.length > 0 ? (
          <ul>
            {order.orderItems.map((item, index) => (
              <li key={index}>
                {item.bookTitle} ({item.quantity})
              </li>
            ))}
          </ul>
        ) : (
          <span>No books ordered</span>
        )}
      </div>
    </li>
  );
})}
</ul>
      </div>
      <div className="button-container">
        <button className="button" onClick={handleNewOrderClick}>Add Order</button>
      </div>
    </div>
  );
};

export default OrderPage;
