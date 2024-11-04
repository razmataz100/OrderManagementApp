// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import CustomerPage from './Components/CustomerPage';
import RegisterCustomerPage from './Components/RegisterCustomerPage';
import InventoryPage from './Components/InventoryPage';
import OrderPage from './Components/OrderPage';
import AddOrderPage from './Components/AddOrderPage';
import AddBookPage from './Components/AddBookPage';
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
