import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, toZonedTime } from 'date-fns-tz';
const Saleform = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
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

    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setSaleQuantity(e.target.value);
  };

  const handlePayModeChange = (e) => {
    setPayMode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (selectedProduct === '' || saleQuantity === '' || payMode === '') {
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
        sale_quantity: saleQuantity,
        paymode: payMode
      });
      const {success,message} = response.data;
      if(!success){
        setError(message)
      } 
      else{
        setSuccessMessage("Sale recorded successfully");
        setSelectedProduct('');
        setSaleQuantity('');
        setPayMode('');
        setError('');
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      setError("Error recording sale. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full p-6">
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Record Sale</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="product">
            Product Name
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
          <label className="block text-gray-700 font-bold mb-2" htmlFor="quantity">
            Sale Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={saleQuantity}
            onChange={handleQuantityChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="paymode">
            Payment Mode
          </label>
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
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Record Sale
        </button>
      </form>
    </div>
    </div>
  );
};

const Saletable = () => {
    const [saleData,setSaleData] = useState('')
  useEffect(()=>{
    const fetchSaleData = async() =>{
      try {
        const response = await axios.post("http://localhost:5000/api/fetchSaleData");
        setSaleData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchSaleData();
  },[])
  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete?`)) {
      try {
        await axios.post("http://localhost:5000/api/deleteSalesData", {sales_id:item.sales_id,product_name:item.product_name,sale_quantity:item.sale_quantity} );
        const response = await axios.post("http://localhost:5000/api/fetchSaleData");
        setSaleData(response.data);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  return(
    <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
          <div className="overflow-x-auto max-h-[80vh]">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="w-1/8 py-2 px-4">Product Name</th>
                  <th className="w-1/8 py-2 px-4">Date</th>
                  <th className="w-1/8 py-2 px-4">Sale Quantity</th>
                  <th className="w-1/8 py-2 px-4">Payment Mode</th>
                  <th className="w-1/8 py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {saleData.length > 0 ? (
                  saleData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                      <td className="border px-4 py-2">{item.product_name}</td>
                      <td className="border px-4 py-2">{format(toZonedTime(item.date, 'Asia/Kolkata'),'yyyy-MM-dd', 'Asia/Kolkata')}</td>
                      <td className="border px-4 py-2">{item.sale_quantity}</td>
                      <td className="border px-4 py-2">{item.paymode}</td>
                      <td className="border px-4 py-2"><button
                          onClick={() => handleDelete(item)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button></td>
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
}

const Sale = () => {
    const [showForm, setShowForm] = useState(false)
  return(
    <div>
  <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
    <button
      onClick={() => setShowForm(!showForm)}
      className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
    >
    {showForm ? "Record Sales" : "View Records"}
    </button>
  </div>
  {showForm? <Saletable/>:<Saleform/>}
  </div>
  );
}
export default Sale;
