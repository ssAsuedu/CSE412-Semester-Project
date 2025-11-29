import React from 'react'
import "../styles/Menu/MenuCard.css"
export const MenuCard = ({ item, setCartItems }) => {
  const addToCart = () => {
    setCartItems(prevItems => [...prevItems, item]);
  };

  return (
    <div className="menu-card">
      <h3 className="menu-item-name">{item.name}</h3>
      <p className="menu-item-description">{item.description}</p>
      <p className="menu-item-price">Price: ${Number(item.price).toFixed(2)}</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  )
}
export default MenuCard;