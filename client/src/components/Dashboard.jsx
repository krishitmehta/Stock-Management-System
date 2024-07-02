import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [amount, setAmount] = useState(0);
  const [sales, setSales] = useState(0);
  const [online,setOnline] = useState(0);
  const [cash,setCash] = useState(0);
  const [zomato,setZomato] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.post('http://localhost:5000/api/fetchDashboardData/sales');
        setSales(response1.data[0].total_sales);
        setAmount(response1.data[0].total_amount)
        const response2 = await axios.post('http://localhost:5000/api/fetchDashboardData/group',{
          paymode: "Zomato"
        });
        setZomato(parseInt(response2.data[0].total_amount,10))
        const response3 = await axios.post('http://localhost:5000/api/fetchDashboardData/group',{
          paymode: "Online"
        });
        setOnline(response3.data[0].total_amount);
        const response4 = await axios.post('http://localhost:5000/api/fetchDashboardData/group',{
          paymode: "Cash"
        });
        setCash(response4.data[0].total_amount)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
    <button
      //onClick={handleLogout}
      className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
    >
      <span>Log out</span>
    </button>
    </div>
        <div className="flex flex-row h-fit">
        <div className="bg-yellow-200 shadow-md rounded-lg p-6 m-4 w-64">
            <h2 className="text-xl font-bold mb-4 text-center">Sales Amount</h2>
            <p className="text-2xl text-center">{amount?amount:0}</p>
        </div>
        <div className="bg-yellow-200 shadow-md rounded-lg p-6 m-4 w-64">
            <h2 className="text-xl font-bold mb-4 text-center">Sales Quantity</h2>
            <p className="text-2xl text-center">{sales?sales:0}</p>
        </div>
      </div>
      <div className="flex flex-row h-fit">
        <div className="bg-red-200 shadow-md rounded-lg p-6 m-4 w-64">
            <h2 className="text-xl font-bold mb-4 text-center">Total Online</h2>
            <p className="text-2xl text-center">{online?online:0}</p>
        </div>
        <div className="bg-blue-200 shadow-md rounded-lg p-6 m-4 w-64">
            <h2 className="text-xl font-bold mb-4 text-center">Total Cash</h2>
            <p className="text-2xl text-center">{cash?cash:0}</p>
        </div>
        <div className="bg-green-200 shadow-md rounded-lg p-6 m-4 w-64">
            <h2 className="text-xl font-bold mb-4 text-center">Total Zomato</h2>
            <p className="text-2xl text-center">{zomato?zomato:0}</p>
        </div>
      </div>
      </div>
  );
};

export default Dashboard;
