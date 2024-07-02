import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
const Userform = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [branchName, setBranchName] = useState('');
    const [branches, setBranches] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.post('http://localhost:5000/api/fetchBranchData')
      .then(response => {
        setBranches(response.data);
      })
      .catch(error => {
        console.error('Error fetching branches:', error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError('');
    setSuccess('');
    if(name === '' || email === '' || phone === '' || branchName === ''){
        setError('Please enter all fields')
    }
    else if (!regex.test(email)) {
        setError('Please enter a valid email address');
    }
    else if (phone.length !== 10) {
        setError('Please enter a valid phone');
    }
    else{
    try {
      const response = await axios.post('http://localhost:5000/api/addUserData', {
        name,
        email,
        phone,
        branchName,
      });
      setSuccess('User Added Successfully')
      setName('');
      setEmail('');
      setPhone('');
      setBranchName('')
    } catch (error) {
      console.error('Error adding user:', error);
      setError('An error occurred while adding the user.');
    }
}
  };

  return (
    <div className="max-w-md mx-6 bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add User</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <select
            id="branch"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch.branch_name} value={branch.branch_name}>{branch.branch_name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
const User = () => {
    const [showForm, setShowForm] = useState(false)
  return(
    <div>
  <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
    <button
      onClick={() => setShowForm(!showForm)}
      className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
    >
    {showForm ? "View User" : "Add User"}
    </button>
  </div>
  {showForm? <Userform/>:<Usertable/>}
  </div>
  );
}

const Usertable = () => {
    const [userData, setUserData] = useState([]);
    useEffect(()=>{
        const fetchUser = async() => {
            try{
                const response = await axios.post("http://localhost:5000/api/fetchUserData")
                setUserData(response.data);
            }
            catch(err){
                console.log("Error fetching Branch :",err);
            }
        }
        fetchUser();
    },[])
    return(
        <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
              <div className="overflow-x-auto max-h-[80vh]">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="w-1/8 py-2 px-4">Name</th>
                      <th className="w-1/8 py-2 px-4">Email</th>
                      <th className="w-1/8 py-2 px-4">Phone</th>
                      <th className="w-1/8 py-2 px-4">Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.length > 0 ? (
                      userData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                          <td className="border px-4 py-2">{item.name}</td>
                          <td className="border px-4 py-2">{item.email}</td>
                          <td className="border px-4 py-2">{item.phone}</td>
                          <td className="border px-4 py-2">{item.branch_name}</td>
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

export default User;