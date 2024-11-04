import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCustomers = () => {
    navigate('/customers');
  };
  
  const handleOrders = () => {
    navigate('/orders');
  };
  
  const handleInventory = () => {
    navigate('/inventory');
  };

  return (
    <div className="container">
      <h1>Welcome to the Order Management App</h1>
      <div className="button-container">
        <button className="button" onClick={handleCustomers}>Customers</button>
        <button className="button" onClick={handleOrders}>Orders</button>
        <button className="button" onClick={handleInventory}>Inventory</button>
      </div>
    </div>
  );
};

export default LandingPage;
