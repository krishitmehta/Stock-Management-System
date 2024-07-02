import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Branchtable = () => {
    const [branchData, setBranchData] = useState([]);
    useEffect(()=>{
        const fetchBranch = async() => {
            try{
                const response = await axios.post("http://localhost:5000/api/fetchBranchData")
                setBranchData(response.data);
            }
            catch(err){
                console.log("Error fetching Branch :",err);
            }
        }
        fetchBranch();
    },[])
    return(
        <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
              <div className="overflow-x-auto max-h-[80vh]">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="w-1/8 py-2 px-4">Branch Name</th>
                      <th className="w-1/8 py-2 px-4">Branch Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchData.length > 0 ? (
                      branchData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                          <td className="border px-4 py-2">{item.branch_name}</td>
                          <td className="border px-4 py-2">{item.branch_address}</td>
                          {/* <td className="border px-4 py-2"><button>Delete</button></td> */}
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
const Branchform = () => {
    const [branchName, setBranchName] = useState('');
    const [branchAddress, setBranchAddress] = useState('');
    const [error, setError] = useState('');
    const [Success, setSuccess] = useState('');
  const handleSubmit = async(event) => {
    event.preventDefault();
    if(branchName === '' || branchAddress === ''){
        setError('Please Enter All Fields')
    }
    else{
        try{
            const response = await axios.post("http://localhost:5000/api/addBranchData",{
                branchName,branchAddress
            })
            const success = response.data.success;
            if(!success){
                setError('Branch Already Exist')
                setSuccess('');
            }
            else{
                setSuccess('Branch Added Successfully');
                setError('')
                setBranchAddress('');
                setBranchName('');
            }
        }
        catch(err){
            console.log("Error Adding Branch :",err);
        }
    }
  };

  return (
    <div className="max-w-md m-6 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Branch</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {Success && <p className="text-green-500 mb-4">{Success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
            Branch Name
          </label>
          <input
            type="text"
            id="branchName"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="branchAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Branch Address
          </label>
          <input
            type="text"
            id="branchAddress"
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Branch
        </button>
      </form>
    </div>
  );
}
const Branch = () => {
    const [showForm, setShowForm] = useState(false)
  return(
    <div>
  <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
    <button
      onClick={() => setShowForm(!showForm)}
      className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
    >
    {showForm ? "View Branch" : "Add Branch"}
    </button>
  </div>
  {showForm? <Branchform/>:<Branchtable/>}
  </div>
  );
}

export default Branch;