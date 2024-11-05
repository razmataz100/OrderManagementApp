import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerPage.css';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const apiUrl = "https://ordermanagementapi.azurewebsites.net";

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/customers`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally { 
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerClick = async (customer) => {
    setSelectedCustomer(customer); 

    try {
      const response = await fetch(`${apiUrl}/api/orders/customer/${customer.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      const orders = await response.json();
      setOrderDetails(orders);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewCustomerClick = () => {
    navigate('/register');
  };

  const handleBackClick = () => {
    setSelectedCustomer(null);
    setOrderDetails([]);
  };

  if (loading) return <p>Loading customers...</p>;

  return (
    <div className="container">
      {!selectedCustomer && ( 
        <button className="back-button" onClick={() => navigate('/')}>Back</button>
      )}
      {!selectedCustomer && <h1>Customers</h1>}
      <div className="scrollable-box">
        {!selectedCustomer ? ( 
          <ul>
            {customers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleCustomerClick(customer)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedCustomer?.id === customer.id ? '#f0f0f0' : 'transparent', 
                }}
              >
                {customer.name} - {customer.email}
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <h2>Order details for {selectedCustomer.name}</h2>
            {orderDetails.length > 0 ? ( 
              <ul>
                {orderDetails.map(order => (
                  <li key={order.orderId}>
                    <div>
                      <strong>Order ID:</strong> {order.orderId} <br /> 
                      <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()} <br />
                      <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)} <br />
                      <strong>Books Ordered:</strong> 
                      {order.orderItems.length > 0 && (
                        <ul>
                          {order.orderItems.map((item, index) => (
                            <li key={index}>
                              {item.bookTitle} ({item.quantity})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found for this customer.</p>
            )}
          </div>
        )}
      </div>
      <div className="button-container">
        {selectedCustomer && (
          <button className="button" onClick={handleBackClick}>Back to Customers</button>
        )}
        {!selectedCustomer && ( 
          <button className="button" onClick={handleNewCustomerClick}>New Customer</button>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
