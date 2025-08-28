import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import '../styles/AuthLanding.css';

const AuthLanding = () => {
  const [showSignUp, setShowSignUp] = React.useState(false);

  return (
    <div className="auth-landing-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome to Caterpillar SmartRent</h2>
        <div className="auth-toggle">
          <button
            className={`auth-btn${!showSignUp ? ' active' : ''}`}
            onClick={() => setShowSignUp(false)}
          >
            Login
          </button>
          <button
            className={`auth-btn${showSignUp ? ' active' : ''}`}
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </button>
        </div>
        <div className="auth-form">
          {!showSignUp ? <SignIn  /> : <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
