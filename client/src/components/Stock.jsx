import React, { useEffect, useState } from "react";
import axios from "axios";

const Stocktable = () => {
  const [stockData, setStockData] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [addingValue, setAddingValue] = useState({});
  const [leftValue, setLeftValue] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [cash, setCash] = useState('');
  const [gpay, setGpay] = useState('');
  const [zomato, setZomato] = useState('');
  const [expenses, setExpenses] = useState('');

  const totalAmount = parseFloat(cash || 0) + parseFloat(gpay || 0) + parseFloat(zomato || 0) + parseFloat(expenses || 0);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/fetchStockData");
        setStockData(response.data);

        const branches = ['All', ...new Set(response.data.map(item => item.branch_name))];
        setBranchList(branches);
        
        setError('');
        setMessage('');
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to fetch stock data. Please try again later.");
      }
    };

    fetchStockData();
  }, []);

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleAddInputChange = (e, index) => {
    const value = e.target.value;
    setAddingValue(prev => ({ ...prev, [index]: value }));
  };

  const handleLeftInputChange = (e, index) => {
    const value = e.target.value;
    setLeftValue(prev => ({ ...prev, [index]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const updatedStockData = stockData.map((item, index) => {
        const addingAmount = parseInt(addingValue[index] || 0, 10);
        const leftAmount = parseInt(leftValue[index] || 0, 10);
        const currentStockLeft = parseInt(item.stock_left || 0);
        const price = parseFloat(item.product_price) || 0;  // Default price to 0 if null or undefined
        const opening_stock = parseInt(item.opening_stock) || 0;  // Default opening stock to 0 if null or undefined
  
        // Check for invalid stock values or insufficient stock
        if (addingAmount < 0 || isNaN(addingAmount) || currentStockLeft + addingAmount < leftAmount) {
          throw new Error("Invalid stock or insufficient stock.");
        }
  
        // Ensure the price is valid before proceeding
        if (price <= 0) {
          throw new Error(`Price for ${item.product_name} is invalid or missing.`);
        }
  
        return {
          product_name: item.product_name,
          branch_name: item.branch_name,
          added_stock: addingAmount,
          stock_left: leftAmount,
          price: price,
          opening_stock: opening_stock
        };
      });
  
      // Update stock data in the database for all items
      await Promise.all(updatedStockData.map(async (data) => {
        await axios.post("http://localhost:5000/api/addStockData", {
          product_name: data.product_name,
          opening_stock: data.opening_stock,
          added_stock: data.added_stock,
          stock_left: data.stock_left,
          branch_name: data.branch_name,
          price: data.price
        });
      }));
  
      // Fetch updated data
      const response = await axios.post("http://localhost:5000/api/fetchStockData");
      setStockData(response.data);
      setAddingValue({});
      setLeftValue({});
      setError('');
      setMessage('Stock updated successfully');
    } catch (error) {
      console.error("Error updating stock:", error);
      setError(error.message || "Failed to update stock. Please try again later.");
      setMessage('');
    }
  };    

  const filteredStockData = selectedBranch === 'All'
    ? stockData
    : stockData.filter(item => item.branch_name === selectedBranch);

  const calculateAmount = (index) => {
    const addingAmount = parseInt(addingValue[index] || 0, 10);
    const leftAmount = parseInt(leftValue[index] || 0, 10);
    const price = parseFloat(filteredStockData[index]?.product_price || 0);
    const openingStock = parseInt(filteredStockData[index]?.opening_stock || 0);

    const netStock = openingStock + addingAmount - leftAmount;

    return netStock * price;
  };

  const totalTableAmount = filteredStockData.reduce((total, item, index) => {
    return total + calculateAmount(index);
  }, 0);

  // Calculate net amount before filter
  const netAmountBeforeFilter = totalTableAmount - totalAmount;

  return (
    <div className="flex flex-col items-center">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white shadow-md z-10 w-full max-w-4xl p-4 mb-6 border-b border-gray-300 flex justify-between items-center">
        {/* Net Amount Display */}
        <div>
          <p className="text-lg font-semibold">Net Amount: {netAmountBeforeFilter.toFixed(2)}</p>
        </div>
        {/* Branch Filter */}
        <div>
          <select
            value={selectedBranch}
            onChange={handleBranchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          >
            {branchList.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full max-w-4xl mb-6 overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Product Name</th>
              <th className="py-2 px-4">Branch Name</th>
              <th className="py-2 px-4">Opening Stock</th>
              <th className="py-2 px-4">Added Stock</th>
              <th className="py-2 px-4">Stock Left</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="border px-4 py-2">
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="text-green-500">{message}</p>}
              </td>
            </tr>
            {filteredStockData.length > 0 ? (
              filteredStockData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <td className="border px-4 py-2">{item.product_name}</td>
                  <td className="border px-4 py-2">{item.branch_name}</td>
                  <td className="border px-4 py-2">{item.opening_stock}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={addingValue[index] || ''}
                      onChange={(e) => handleAddInputChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={leftValue[index] || ''}
                      onChange={(e) => handleLeftInputChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </td>
                  <td className="border px-4 py-2">{item.product_price}</td>
                  <td className="border px-4 py-2">{calculateAmount(index).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">No data available</td>
              </tr>
            )}
            {/* Total Amount Row */}
            {filteredStockData.length > 0 && (
              <tr>
                <td colSpan="5" className="border px-4 py-2 font-semibold text-right">Total Amount:</td>
                <td className="border px-4 py-2 font-semibold">{totalTableAmount.toFixed(2)}</td>
                <td className="border px-4 py-2 text-right">
                  <button
                    onClick={handleSaveClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Expense Form</h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700">Cash</label>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">GPay</label>
              <input
                type="number"
                value={gpay}
                onChange={(e) => setGpay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700">Zomato</label>
              <input
                type="number"
                value={zomato}
                onChange={(e) => setZomato(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Expenses</label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total Expenses: {totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stocktable;