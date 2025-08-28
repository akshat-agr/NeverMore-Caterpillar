import React from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthLanding.css';

const AuthLanding = () => {
  const [showSignUp, setShowSignUp] = React.useState(false);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

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
          {!showSignUp ? (
            <SignIn redirectUrl="/dashboard" />
          ) : (
            <SignUp redirectUrl="/dashboard" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
