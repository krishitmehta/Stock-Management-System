import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, toZonedTime } from 'date-fns-tz';

const Report = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [stockData, setStockData] = useState([]);
  const [expenseType, setExpenseType] = useState([]);
  const [expenseNote, setExpenseNote] = useState([]);

  const [filteredStockData, setFilteredStockData] = useState([]);
  const [filteredExpenseType, setFilteredExpenseType] = useState([]);
  const [filteredExpenseNote, setFilteredExpenseNote] = useState([]);

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.post('http://localhost:5000/api/fetchReportData');
        const response2 = await axios.post('http://localhost:5000/api/fetchExpenseType');
        const response3 = await axios.post('http://localhost:5000/api/fetchExpenseNote');

        setStockData(response1.data);
        setExpenseType(response2.data);
        setExpenseNote(response3.data);

        // Initially set filtered data to full dataset
        setFilteredStockData(response1.data);
        setFilteredExpenseType(response2.data);
        setFilteredExpenseNote(response3.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter Data when Date Changes
  useEffect(() => {
    if (!selectedDate) return;

    console.log("Filtering data for date:", selectedDate);

    setFilteredStockData(
      stockData.filter(item => 
        format(toZonedTime(item.date, 'Asia/Kolkata'), 'yyyy-MM-dd') === selectedDate
      )
    );

    setFilteredExpenseType(
      expenseType.filter(item => 
        format(toZonedTime(item.date, 'Asia/Kolkata'), 'yyyy-MM-dd') === selectedDate
      )
    );

    setFilteredExpenseNote(
      expenseNote.filter(item => 
        format(toZonedTime(item.date, 'Asia/Kolkata'), 'yyyy-MM-dd') === selectedDate
      )
    );
  }, [selectedDate, stockData, expenseType, expenseNote]);

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
    <div className='h-screen overflow-y-auto'>
      <div className="sticky top-0 px-6 py-2 bg-gray-900 flex justify-end">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 mr-5"
        />
        <button
          onClick={downloadCSV}
          className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
        >
          Download CSV
        </button>
      </div>

      {/* Stock Data Table */}
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
                </tr>
              </thead>
              <tbody>
                {filteredStockData.length > 0 ? (
                  filteredStockData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                      <td className="border px-4 py-2">{item.product_name}</td>
                      <td className="border px-4 py-2">{item.branch_name}</td>
                      <td className="border px-4 py-2">
                        {format(toZonedTime(item.date, 'Asia/Kolkata'), 'yyyy-MM-dd')}
                      </td>
                      <td className="border px-4 py-2">{item.sales_quantity}</td>
                      <td className="border px-4 py-2">{item.price}</td>
                      <td className="border px-4 py-2">{item.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="border px-4 py-2 text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expense Form */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 m-6">
  <h3 className="text-lg font-semibold mb-4">Expense Form</h3>
  {selectedDate !== '' && filteredExpenseType.length > 0 ? (
    filteredExpenseType.map((note, index) => (
      <div
        key={index}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg shadow-sm"
      >
        <div className="flex flex-col items-center p-2 bg-white rounded-md shadow">
          <span className="text-gray-500 text-sm">Cash</span>
          <span className="font-semibold text-lg">₹{note.cash}</span>
        </div>

        <div className="flex flex-col items-center p-2 bg-white rounded-md shadow">
          <span className="text-gray-500 text-sm">GPay</span>
          <span className="font-semibold text-lg">₹{note.gpay}</span>
        </div>

        <div className="flex flex-col items-center p-2 bg-white rounded-md shadow">
          <span className="text-gray-500 text-sm">Zomato</span>
          <span className="font-semibold text-lg">₹{note.zomato}</span>
        </div>

        <div className="flex flex-col items-center p-2 bg-white rounded-md shadow">
          <span className="text-gray-500 text-sm">Expenses</span>
          <span className="font-semibold text-lg">₹{note.expenses}</span>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No expenses recorded</p>
  )}
</div>


      {/* Expense Note */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 m-6">
        <h3 className="text-lg font-semibold mb-4">Expense Note</h3>
        <ul className="list-disc pl-6">
          {selectedDate !== '' && filteredExpenseNote.length > 0 ? (
            filteredExpenseNote.map((note, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-md mb-2">
                {note.note} - ₹{note.price}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No expenses recorded</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Report;
