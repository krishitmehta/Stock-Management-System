import React, { useEffect, useState } from "react";
import axios from "axios";

const Stocktable = ({ selectedBranch }) => {
  const [stockData, setStockData] = useState([]);
  const [addingIndex, setAddingIndex] = useState(null);
  const [addingValue, setAddingValue] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/fetchStockData");
        setStockData(response.data);
        setError('');
        setMessage('');
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch stock data. Please try again later.");
      }
    };

    fetchStockData();
  }, []);

  const handleAddClick = (index) => {
    setAddingIndex(index);
    setAddingValue(0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddingValue(value);
  };

  const handleSaveClick = async (product_name, branch_name) => {
    if (addingValue < 0 || isNaN(addingValue)) {
      setError("Invalid stock quantity. Please enter a positive number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/addStockData", {
        product_name,
        added_stock: addingValue,
        branch_name
      });
      const response = await axios.post("http://localhost:5000/api/fetchStockData");
      setStockData(response.data);
      setAddingIndex(null);
      setAddingValue(0);
      setError('');
      setMessage('Stock Added Successfully')
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("Failed to update stock. Please try again later.");
      setMessage('');
    }
  };

  const filteredStockData = selectedBranch === 'All'
    ? stockData
    : stockData.filter(item => item.branch_name === selectedBranch);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
        <div className="overflow-x-auto max-h-[80vh]">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/8 py-2 px-4">Product Name</th>
                <th className="w-1/8 py-2 px-4">Branch Name</th>
                <th className="w-1/8 py-2 px-4">Opening Stock</th>
                <th className="w-1/8 py-2 px-4">Added Stock</th>
                <th className="w-1/8 py-2 px-4">Stock left</th>
                <th className="w-1/8 py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="border px-4 py-2">{error && <p className="text-red-500">{error}</p>}{message && <p className="text-green-500">{message}</p>}</td>
              </tr>
              {filteredStockData.length > 0 ? (
                filteredStockData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border px-4 py-2">{item.product_name}</td>
                    <td className="border px-4 py-2">{item.branch_name}</td>
                    <td className="border px-4 py-2">{item.opening_stock}</td>
                    <td className="border px-4 py-2">
                      {addingIndex === index ? (
                        <input
                          type="number"
                          value={addingValue}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                      ) : (
                        item.added_stock
                      )}
                    </td>
                    <td className="border px-4 py-2">{item.stock_left}</td>
                    <td className="border px-4 py-2">
                      {addingIndex === index ? (
                        <button
                          onClick={() => handleSaveClick(item.product_name, item.branch_name)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddClick(index, item.added_stock)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Add
                        </button>
                      )}
                    </td>
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
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
    </div>
  );
};

const Stock = () => {
  const [branch, setBranch] = useState('All');
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/fetchBranchdata');
        setBranches(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching branches:', error);
        setError("Failed to fetch branch data. Please try again later.");
        setBranches([]); // Ensure branches is set to an empty array on error
      }
    };

    fetchBranches();
  }, []);

  return (
    <div>
      <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
        <div>
          <label className="text-white mr-2">Select Branch:</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded"
          >
            <option value="All">All</option>
            {Array.isArray(branches) && branches.map((branchItem) => (
              <option key={branchItem.branch_name} value={branchItem.branch_name}>
                {branchItem.branch_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      <Stocktable selectedBranch={branch} />
    </div>
  );
};

export default Stock;