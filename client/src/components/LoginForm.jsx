import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SignupForm from './SignupForm';
import NavBar from './NavBar';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === '' || password.trim() === '') {
      setError('Please enter both email and password');
    } else if (!regex.test(email)) {
      setError('Please enter a valid email address');
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const { success, message } = response.data;
        if (success) {
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
          setEmail('');
          setPassword('');
        } else {
          setError(message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  if (isLoggedIn) {
    return <NavBar setIsLoggedIn={setIsLoggedIn}/>;
  }

  return (
    <div className="flex w-screen justify-center items-center h-screen bg-gray-100">
      {showSignup ? (
        <SignupForm onLoginClick={() => setShowSignup(false)} />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Sher-E-Punjab</h2>
          <p className="text-gray-600 text-center mb-6">Login to access website</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
            >
              Login
            </button>
            <button
              onClick={handleSignupClick}
              className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;