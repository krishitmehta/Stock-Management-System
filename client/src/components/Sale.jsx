import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, toZonedTime } from 'date-fns-tz';

const Saletable = () => {
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(''); // New state for selected branch
  const [saleQuantity, setSaleQuantity] = useState('');
  const [payMode, setPayMode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/fetchProductData");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchBranches = async () => { // Fetch branches data
      try {
        const response = await axios.post("http://localhost:5000/api/fetchBranchdata");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchProducts();
    fetchBranches(); // Fetch branches data on component mount
  }, []);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleBranchChange = (e) => { // Handle branch change
    setSelectedBranch(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setSaleQuantity(e.target.value);
  };

  const handlePayModeChange = (e) => {
    setPayMode(e.target.value);
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    if (selectedProduct === '' || selectedBranch === '' || saleQuantity === '' || payMode === '') {
      setError("Please fill in all fields");
      return;
    }

    if (saleQuantity <= 0) {
      setError("Enter a valid sale quantity");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/addSaleData", {
        product_name: selectedProduct,
        branch_name: selectedBranch,
        sale_quantity: saleQuantity,
        paymode: payMode
      });
      const { success, message } = response.data;
      if (!success) {
        setError(message);
      } else {
        setSuccessMessage("Sale recorded successfully");
        setSelectedProduct('');
        setSelectedBranch(''); // Reset branch selection
        setSaleQuantity('');
        setPayMode('');
        setError('');
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      setError("Error recording sale. Please try again.");
    }
    try {
      const response = await axios.post("http://localhost:5000/api/fetchSaleData");
      setSaleData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const [saleData, setSaleData] = useState([]);
  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/fetchSaleData");
        setSaleData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchSaleData();
  }, []);

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete?`)) {
      try {
        await axios.post("http://localhost:5000/api/deleteSalesData", {
          sales_id: item.sales_id,
          product_name: item.product_name,
          sale_quantity: item.sale_quantity,
        });
        const response = await axios.post("http://localhost:5000/api/fetchSaleData");
        setSaleData(response.data);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
        <div className="overflow-x-auto max-h-[80vh]">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/8 py-2 px-4">Product Name</th>
                <th className="w-1/8 py-2 px-4">Branch Name</th>
                <th className="w-1/8 py-2 px-4">Date</th>
                <th className="w-1/8 py-2 px-4">Sale Quantity</th>
                <th className="w-1/8 py-2 px-4">Payment Mode</th>
                <th className="w-1/8 py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="border px-4 py-2">{error && <p className="text-red-500">{error}</p>}{successMessage && <p className="text-green-500">{successMessage}</p>}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  <select
                    id="product"
                    value={selectedProduct}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                    <option key={product.product_name} value={product.product_name}>
                      {product.product_name}
                    </option>
                    ))}
                  </select></td>
                <td className="border px-4 py-2">
                  <select
                    id="branch"
                    value={selectedBranch}
                    onChange={handleBranchChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch.branch_name} value={branch.branch_name}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2">{format(toZonedTime(new Date(), 'Asia/Kolkata'), 'yyyy-MM-dd', 'Asia/Kolkata')}</td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    id="quantity"
                    value={saleQuantity}
                    onChange={handleQuantityChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </td>
                <td className="border px-4 py-2">
                  <select
                    id="paymode"
                    value={payMode}
                    onChange={handlePayModeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  >
                    <option value="">Select payment mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Zomato">Zomato</option>
                    <option value="Online">Online</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleSubmit()}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Record
                  </button>
                </td>
              </tr>
              {saleData.length > 0 ? (
                saleData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border px-4 py-2">{item.product_name}</td>
                    <td className="border px-4 py-2">{item.branch_name}</td>
                    <td className="border px-4 py-2">{format(toZonedTime(item.date, 'Asia/Kolkata'), 'yyyy-MM-dd', 'Asia/Kolkata')}</td>
                    <td className="border px-4 py-2">{item.sale_quantity}</td>
                    <td className="border px-4 py-2">{item.paymode}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
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
  );
};

const Sale = () => {
  const [branch,setBranch] = useState();
  const [branches,setBranches] = useState();
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/fetchBranchdata");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches(); // Fetch branches data on component mount
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
      <Saletable />
    </div>
  );
};

export default Sale;