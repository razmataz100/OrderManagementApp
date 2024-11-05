// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/Home/LandingPage';
import CustomerPage from './Pages/Customers/CustomerPage';
import RegisterCustomerPage from './Pages/Customers/RegisterCustomerPage';
import InventoryPage from './Pages/Inventory/InventoryPage';
import OrderPage from './Pages/Orders/OrderPage';
import AddOrderPage from './Pages/Orders//AddOrders/AddOrderPage';
import AddBookPage from './Pages/Inventory/AddBooks/AddBookPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/register" element={<RegisterCustomerPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/add-order" element={<AddOrderPage />} />
          <Route path="/add-book" element={<AddBookPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
