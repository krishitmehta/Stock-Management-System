import React from 'react';
import { Link, BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Product from './Product';
import User from './User';
import Branch from './Branch';
import Stock from './Stock';
import Logout from './Logout';
import Report from './Report';
import Sale from './Sale';

const Navigation = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transition-transform duration-300 md:relative md:translate-x-0">
        <div className="flex flex-col h-full">
          <div className="w-full px-6 py-4 bg-gray-900">
            <h2 className="text-white font-bold text-center">Sher-E-Punjab</h2>
          </div>
          <nav className="mt-6 px-3 flex-grow">
            <div className="space-y-2 h-full overflow-y-auto">
              <Link to="/dashboard" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Dashboard</span>
              </Link>
              <Link to="/users" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Users</span>
              </Link>
              <Link to="/products" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Product</span>
              </Link>
              <Link to="/branches" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Branch</span>
              </Link>
              <Link to="/stock" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Stock</span>
              </Link>
              <Link to="/reports" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Report</span>
              </Link>
              <Link to="/sales" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Sales</span>
              </Link>
              <Link to="/logout" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md w-full text-left">
                <span className="ml-2">Logout</span>
              </Link>
              {/* Add more sidebar links as needed */}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

const MainContent = ({ setIsLoggedIn }) => {
  return (
    <div className="flex-grow">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<User />} />
        <Route path="/products" element={<Product />} />
        <Route path="/branches" element={<Branch />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/sales" element={<Sale />} />
        <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </div>
  );
};

const NavBar = ({ setIsLoggedIn }) => {
  return (
    <Router>
      <div className="flex">
        <Navigation />
        <MainContent setIsLoggedIn={setIsLoggedIn} />
      </div>
    </Router>
  );
};

export default NavBar;