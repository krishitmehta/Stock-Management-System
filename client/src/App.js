import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const App = () => {
  const [showSignup, setShowSignup] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  return (
    <div className="container">
      <LoginForm onSignupClick={handleSignupClick} />
      {showSignup && <SignupForm />}
    </div>
  );
};

export default App;