import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="nav-btn" onClick={() => navigate('/menu')}>Menu</button>
        <button className="nav-btn" onClick={() => navigate('/orders')}>Orders</button>
      </div>
      <div className="navbar-right">
        <button className="nav-btn logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
