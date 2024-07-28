import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_price: 0,
  });
  const [editData, setEditData] = useState({
    product_name: "",
    new_price: 0,
  });
  const [error, setError] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value.toUpperCase(),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.product_name === "") {
      setError("Please enter all fields");
    } else if (formData.product_price <= 0) {
      setError("Enter the price properly");
    } else {
      try {
        await axios.post("http://localhost:5000/api/addProductData", formData);
        setFormData({ product_name: "", product_price: "" });
        setShowForm(false);
        const response = await axios.post("http://localhost:5000/api/fetchProductData");
        setProducts(response.data);
        setError('');
      } catch (error) {
        setError('Product already exists');
        console.error("Error adding product:", error);
      }
    }
  };

  const handleDelete = async (productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        await axios.post("http://localhost:5000/api/deleteProductData", { product_name: productName });
        const response = await axios.post("http://localhost:5000/api/fetchProductData");
        setProducts(response.data);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditPrice = (productName) => {
    const product = products.find(p => p.product_name === productName);
    setEditData({ product_name: product.product_name, new_price: product.product_price });
  };

  const handleEditPriceChange = (e) => {
    const { value } = e.target;
    setEditData((prevEditData) => ({
      ...prevEditData,
      new_price: value,
    }));
  };

  const handleEditPriceSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/editProductPrice", { product_name: editData.product_name, new_price: editData.new_price });
      const response = await axios.post("http://localhost:5000/api/fetchProductData");
      setProducts(response.data);
      setEditData({ product_name: "", new_price: 0 });
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
        >
          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>
      {showForm && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 px-8">Add Product</h2>
          {error && <p className="text-red-500 mb-4 px-8">{error}</p>}
          <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded px-8 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_name">
                Product Name
              </label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_price">
                Price
              </label>
              <input
                type="number"
                id="product_price"
                name="product_price"
                value={formData.product_price}
                onChange={handleInputChange}
                placeholder={0}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex-grow overflow-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.product_name} className="bg-yellow-200 shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">{product.product_name}</h2>
              <p className="text-gray-700">Price: ₹{product.product_price}</p>
              <button
                onClick={() => handleDelete(product.product_name)}
                className="text-white px-2 py-1 mr-2 bg-red-500 hover:bg-red-700 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleEditPrice(product.product_name)}
                className="text-white px-2 py-1 bg-blue-500 hover:bg-blue-700 rounded"
              >
                Edit Price
              </button>
              {editData.product_name === product.product_name && (
                <form onSubmit={handleEditPriceSubmit} className="mt-4">
                  <input
                    type="number"
                    value={editData.new_price}
                    onChange={handleEditPriceChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    Update Price
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
