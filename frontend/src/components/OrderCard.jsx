import React from 'react'
import "../styles/OrderCard.css";
export const OrderCard = ({ order }) => {

  const formattedDate = order.orderdate
    ? new Date(order.orderdate).toLocaleDateString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    })
    : '';

  var statusClass;
  if (order.status.toLowerCase() === "pending") {
    statusClass = "status pending";
  }
  else {
    statusClass = "status completed";
  }
  return (
    <div className="order-card">
      <h4>Order #{order.orderid}</h4>
      <p>Date: {formattedDate}</p>
      <p>Total: ${order.totalprice.toFixed(2)}</p>
      <span className={statusClass}>{order.status}</span>
    </div>
  )
}
export default OrderCard;