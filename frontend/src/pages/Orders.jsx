import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { fetchOrders } from '../api';
import "../styles/Orders.css";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.id) return;

    const getOrders = async () => {
      try {
        const data = await fetchOrders(user.id);
        setOrders(data);

        const past = data.filter(order => order.status === 'Complete' || order.status === 'Cancelled');
        const active = data.filter(order => order.status === 'Pending' || order.status === 'In Progress');

        setPastOrders(past);
        setActiveOrders(active);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    getOrders();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="orders-full-page">
        <div className="orders-container" style={{ padding: 24 }}>
          <div className="active-orders-container">
            <h3>Active Orders</h3>
            {activeOrders.length === 0 ? (
              <p>No active orders.</p>
            ) : (
              <ul>
                {activeOrders.map(order => (

                  <OrderCard order={order} key={order.orderid} />

                ))}
              </ul>
            )}
          </div>
          <div className="past-orders-container">
            <h3>Past Orders</h3>
            {pastOrders.length === 0 ? (
              <p>No past orders.</p>
            ) : (
              <ul>
                {activeOrders.map(order => (
                  <li key={order.orderid} className="order-item">
                    <OrderCard order={order} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;