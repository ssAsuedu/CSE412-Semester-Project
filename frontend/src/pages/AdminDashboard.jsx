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
      setTotalRevenue(orders.reduce((acc, order) => acc + order.totalprice, 0));
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
    <div>
      <AdminNavbar />
      <div className="stats-container">
        <div className="line-chart" style={{ width: 900, height: 600 }}>
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
            height={600}
          />
        </div>
        <div className='stats'>
          <h2>Total Revenue: ${totalRevenue}</h2>
          <h2>Total Orders: {totalOrders}</h2>
          <h2>Active Orders: {totalActiveOrders}</h2>
          <h2>Completed Orders: {totalCompletedOrders}</h2>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;