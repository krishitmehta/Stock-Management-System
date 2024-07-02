import React, { useEffect, useState } from "react";
import axios from "axios";

const Stockform = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [stockQuantity, setStockQuantity] = useState();
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

    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleStockChange = (e) => {
    setStockQuantity(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('')
    if (selectedProduct === '' || stockQuantity === '') {
      setError("Please select a product and enter stock quantity");
      return;
    }

    if (stockQuantity <= 0) {
      setError("Enter a valid stock quantity");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/addStockData", {
        product_name: selectedProduct,
        stock_quantity: stockQuantity,
      });
      setSuccessMessage("Stock added successfully");
      setSelectedProduct('');
      setStockQuantity('');
      setError('');
    } catch (error) {
      console.error("Error adding stock:", error);
      setError("Error adding stock. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add Stock</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="product">
              Select Product
            </label>
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
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="stock">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              value={stockQuantity}
              placeholder={0}
              onChange={handleStockChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
};

const Stocktable = () => {
  const [stockData, setStockData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [originalAddedStock, setOriginalAddedStock] = useState(null);
  const [error,setError] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/fetchStockData");
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchStockData();
  }, []);

  const handleEditClick = (index, currentValue) => {
    setEditingIndex(index);
    setEditingValue(currentValue);
    setOriginalAddedStock(currentValue); // Store the original added stock value
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value < 0 ? -e.target.value : e.target.value;
    const stockLeft = stockData[editingIndex].stock_left + parseInt(newValue) - originalAddedStock;

    if (stockLeft >= 0) {
      setEditingValue(newValue);
    } else {
      setError("Invalid stock value. Resulting stock left cannot be negative.");
    }
  };

  const handleSaveClick = async (product_name) => {
    try {
      await axios.post("http://localhost:5000/api/editStockData", {
        product_name,
        added_stock: editingValue,
      });
      const response = await axios.post("http://localhost:5000/api/fetchStockData");
      setStockData(response.data);
      setEditingIndex(null);
      setEditingValue('');
      setOriginalAddedStock(null); // Reset the original added stock value
    } catch (error) {
      console.error("Error updating stock:", error);
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
                <th className="w-1/8 py-2 px-4">Opening Stock</th>
                <th className="w-1/8 py-2 px-4">Added Stock</th>
                <th className="w-1/8 py-2 px-4">Stock left</th>
                <th className="w-1/8 py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {stockData.length > 0 ? (
                stockData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border px-4 py-2">{item.product_name}</td>
                    <td className="border px-4 py-2">{item.opening_stock}</td>
                    <td className="border px-4 py-2">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          value={editingValue}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        />
                      ) : (
                        item.added_stock
                      )}
                    </td>
                    <td className="border px-4 py-2">{item.stock_left}</td>
                    <td className="border px-4 py-2">
                      {editingIndex === index ? (
                        <button
                          onClick={() => handleSaveClick(item.product_name)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(index, item.added_stock)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-4 py-2 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Stock = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
        >
          {showForm ? "Close Form" : "Add Stock"}
        </button>
      </div>
      {showForm ? <Stockform /> : <Stocktable />}
    </div>
  );
};

export default Stock;