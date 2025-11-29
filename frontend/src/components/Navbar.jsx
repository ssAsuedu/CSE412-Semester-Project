import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../logo.svg';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Sun Devil Cafe Logo" className="navbar-logo"/>
        <a className="nav-btn" onClick={() => navigate('/menu')}>Menu</a>
        <a className="nav-btn" onClick={() => navigate('/orders')}>Orders</a>
      </div>
      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;
