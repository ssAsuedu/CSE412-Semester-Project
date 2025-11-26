import React, { useState, useEffect } from 'react'
import { fetchMenuItems, checkoutOrder } from '../api';
import MenuCard from '../components/MenuCard';
import Navbar from '../components/Navbar';
import "../styles/Menu/Menu.css"
export const Menu = () => {

const [menuItems, setMenuItems]  = useState([]);
const [error, setError] = useState(null);
const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const items = await fetchMenuItems();
        setMenuItems(items);
      } catch (error) {
        setError("Failed to retrieve menu items.");
        console.error('Error fetching menu items:', error);
      }
    };

    getMenuItems();
  }, []);
const checkoutCart = async () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.id) {
    alert("You must be logged in to checkout.");
    return;
  }
  const items = cartItems.map(item => item.menuid); // Use menuid from each menu item
  const totalprice = cartItems.reduce((total, item) => total + item.price, 0);
  const orderdate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    await checkoutOrder({
      userid: user.id,
      totalprice,
      orderdate,
      status: 'Pending',
      items,
    });
    // alert("Order placed successfully!");
    setCartItems([]);
  } catch (err) {
    alert("Failed to place order: " + err.message);
  }
};
  return (
    <>
    <Navbar />
    <div className='top-level-menu-container'>
    <div className='menu-container'>
      <h2 className="menu-title">Menu</h2>
      {error && <div className="error-message">{error}</div>}
      <ul className="menu-list">
        {menuItems.map(item => (
            <MenuCard key={item.id} item={item} setCartItems={setCartItems} />
        ))}
      </ul>
    </div>
    <div>
       <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <ul className="cart-item-list">
            {cartItems.map((item, index) => (
              <h4 key={index} className="cart-item">
                {item.name} - ${item.price.toFixed(2)}
              </h4>
            ))}
          </ul>
        )}
        <div className="cart-summary">
        <div className="cart-total">
          <span>Total: </span>
          <span>
            ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
          </span>
        </div>
        <button className="checkout-button" onClick={() => checkoutCart()}>Checkout</button>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Menu;