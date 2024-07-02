import React from 'react';
import axios from 'axios';


const Logout = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="w-full px-6 py-2 bg-gray-900 flex justify-end">
    <button
      onClick={handleLogout}
      className="text-white font-bold p-2 bg-blue-500 hover:bg-blue-700 rounded"
    >
      <span>Log out</span>
    </button>
    </div>
  );
};

export default Logout;
