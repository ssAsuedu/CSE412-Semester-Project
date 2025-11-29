import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../logo.svg';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Sun Devil Cafe Logo" className="navbar-logo"/>
        <button className="nav-btn" onClick={() => navigate('/manageorders')}>Manage Orders</button>
        <button className="nav-btn" onClick={() => navigate('/admin')}>Operations Dashboard</button>
      </div>
      <div className="navbar-right">
        <button className="nav-btn logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;