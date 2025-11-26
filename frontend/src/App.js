import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import AdminOrders from './pages/AdminOrders';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/manageorders" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
