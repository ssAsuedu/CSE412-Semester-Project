import React, { useState, useEffect } from 'react'
import AdminNavbar from '../components/AdminNavbar';
import "../styles/AdminDashboard.css"
import { fetchAllOrders } from '../api';
import { LineChart } from '@mui/x-charts/LineChart';

const AdminDashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalActiveOrders, setTotalActiveOrders] = useState(0);
  const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);  
  const [chartData, setChartData] = useState({ dates: [], revenues: [] });
  const [minDate, setMinDate] = useState(undefined);
  const [maxDate, setMaxDate] = useState(undefined);

  useEffect(() => {
    const getAllOrders = async () => {
      const orders = await fetchAllOrders();
      setAllOrders(orders);
      setTotalOrders(orders.length);
      setTotalActiveOrders(orders.filter(order => order.status === 'Pending').length);
      setTotalCompletedOrders(orders.filter(order => order.status === 'Complete').length);
      const revenue = orders.reduce((acc,order) => acc + Number(order.totalprice ?? 0), 0); 
      setTotalRevenue(revenue);
      const sorted = [...orders]
        .filter(order => order.orderdate && !isNaN(Number(order.totalprice)))
        .sort((a, b) => new Date(a.orderdate) - new Date(b.orderdate));

      const dateMap = {};
      let cumulative = 0;
      sorted.forEach(order => {
        const date = new Date(order.orderdate);
        const dateKey = date.getTime(); 
        cumulative += Number(order.totalprice);
        dateMap[dateKey] = cumulative;
      });
      const dates = Object.keys(dateMap).map(Number); 
      const revenues = Object.values(dateMap).map(Number);
      setChartData({ dates, revenues });
      console.log('Chart dates:', dates);
      console.log('Chart revenues:', revenues);

      if (dates.length > 0) {
        setMinDate(Math.min(...dates));
        setMaxDate(Math.max(...dates));
      }
    };
    getAllOrders();
  }, []);
  
  return (
  <div className="admin-dashboard">
    <AdminNavbar />

    <div className="stats-container">
      {/*the chart on the left side of the dashboard*/}
      <div className="line-chart-card">
        <h2 className="section-title">Revenue Over Time</h2>
        <LineChart
          xAxis={[{
            data: chartData.dates,
            label: 'Date',
            scaleType: 'time',
            tickNumber: 4,
            min: minDate,
            max: maxDate,
            valueFormatter: (value) => {
              const d = new Date(value);
              return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
            }
          }]}
          series={[{ data: chartData.revenues, label: 'Cumulative Revenue ($)' }]}
          width={900}
          height={400}
        />
      </div>

      {/*summary stats on the right side*/}
      <div className="stats-panel">
        <h2 className="section-title">Operations Summary</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{totalOrders}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Active Orders</span>
            <span className="stat-value stat-pill stat-pill--active">
              {totalActiveOrders}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Completed Orders</span>
            <span className="stat-value stat-pill stat-pill--complete">
              {totalCompletedOrders}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default AdminDashboard;