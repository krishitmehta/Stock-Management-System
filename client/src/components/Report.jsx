import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, toZonedTime } from 'date-fns-tz';
const Report = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/fetchReportData');
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const downloadCSV = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/downloadReportData', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <div>
      <div className="px-6 py-2 bg-gray-900 flex justify-end">
          <button
            onClick={downloadCSV}
            className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
          >
            {/* {showForm ? "Close Form" : "Add Product"} */}
            Download CSV
          </button>
        </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
          <div className="overflow-x-auto max-h-[80vh]">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="w-1/8 py-2 px-4">Product Name</th>
                  <th className="w-1/8 py-2 px-4">Branch Name</th>
                  <th className="w-1/8 py-2 px-4">Date</th>
                  <th className="w-1/8 py-2 px-4">Sales Quantity</th>
                  <th className="w-1/8 py-2 px-4">Price</th>
                  <th className="w-1/8 py-2 px-4">Amount</th>
                  <th className="w-1/8 py-2 px-4">Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {stockData.length > 0 ? (
                  stockData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                      <td className="border px-4 py-2">{item.product_name}</td>
                      <td className="border px-4 py-2">{item.branch_name}</td>
                      <td className="border px-4 py-2">{format(toZonedTime(item.date, 'Asia/Kolkata'),'yyyy-MM-dd', 'Asia/Kolkata')}</td>
                      <td className="border px-4 py-2">{item.sales_quantity}</td>
                      <td className="border px-4 py-2">{item.price}</td>
                      <td className="border px-4 py-2">{item.amount}</td>
                      <td className="border px-4 py-2">{item.paymode}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="border px-4 py-2 text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Report;