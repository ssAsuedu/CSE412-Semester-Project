import React, { useEffect, useState } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { fetchAllOrders } from '../api'
import AdminOrderCard from '../components/AdminOrderCard'
import "../styles/AdminOrders.css";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([])

  const loadOrders = async () => {
    try {
      const allOrders = await fetchAllOrders()
      setOrders(allOrders)
    } catch (error) {
      console.error('Error fetching all orders:', error)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderid === orderId ? { ...order, status: newStatus } : order
      )
    );

    loadOrders();
  };

  return (
    <div className="admin-orders-full-page">
      <AdminNavbar />
      <h2 className="page-title">Manage Orders</h2>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <AdminOrderCard
                order={order}
                key={order.orderid}
                onStatusUpdate={() => handleStatusUpdate(order.orderid, 'Complete')}
              />
            ))}
          </div>
        )}
      </div>
    </div>

  )
}
export default AdminOrders;