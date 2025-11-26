import React from 'react'
import "../styles/AdminOrderCard.css";
import { updateOrderStatus } from "../api.js"

export const AdminOrderCard = ({ order, onStatusUpdate }) => {
    const formattedDate = order.orderdate
    ? new Date(order.orderdate).toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      })
    : '';
  const handleMarkComplete = async () => {
    try {
      await updateOrderStatus(order.orderid);
      if (onStatusUpdate) {
        onStatusUpdate(); // Correct prop name
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="order-card">
      <h3>Order ID: {order.orderid}</h3>
      <p>User ID: {order.userid}</p>
      <p>Total Price: ${order.totalprice.toFixed(2)}</p>
      <p>Order Date: {formattedDate}</p>
      <p>Status: {order.status}</p>
      {order.status === 'Pending' && (
        <button className="update-status-button" onClick={handleMarkComplete}>Mark Complete</button>
      )}
    </div>
  )
}
export default AdminOrderCard;