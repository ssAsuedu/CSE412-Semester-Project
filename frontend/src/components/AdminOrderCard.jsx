import React from 'react'
import "../styles/AdminOrderCard.css";
import { updateOrderStatus, deleteOrder } from "../api.js"

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
        onStatusUpdate(); 
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  const handleDelete = async () => {
    try {
      await deleteOrder(order.orderid);
      if (onStatusUpdate) {
        onStatusUpdate(); 
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  var cardClass;
  var statusClass;
  if (order.status.toLowerCase() === "complete") {
    cardClass = "complete card"
    statusClass = "complete";
  }
  else {
    statusClass = "pending";
  }
  return (
    <div className={`order-card ${cardClass}`}>
      <h3>Order ID: {order.orderid}</h3>
      <p>User ID: {order.userid}</p>
      <p>Total Price: ${Number(order.totalprice).toFixed(2)}</p>
      <p>Order Date: {formattedDate}</p>
      <p>Status: <span className={`status ${statusClass}`}>{order.status}</span></p>
      {order.status === 'Pending' && (
        <button className="update-status-button" onClick={handleMarkComplete}>Mark Complete</button>
      )}
      <button className="delete-order-button" onClick={handleDelete}>Delete Order</button>
    </div>
  )
}
export default AdminOrderCard;