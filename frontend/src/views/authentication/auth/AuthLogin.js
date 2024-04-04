import React, { useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from '../../../firebase_config'; // Import Firebase Authentication
import './google.css' // Import Google Sign-In Button CSS
import GoogleIcon from '@mui/icons-material/Google'; // Import Google Icon

const AuthLogin = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    // Check if user is already logged in
    if (auth.currentUser) {
      // Redirect to Dashboard
      navigate('/dashboard');
    }
  }, []); // Empty dependency array to run only once on component mount

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect to Dashboard after successful authentication
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Typography fontWeight="700" variant="h2" mb={1} style={{textAlign:"center"}}>
        Sign in
      </Typography>

      {/* Google Sign-In Button */}
      <div className="button-container">
        <Button
          variant="contained"
          onClick={handleGoogleSignIn}
          className="google-login-button"
        >
          <GoogleIcon sx={{ marginRight: '8px' }} />
          Sign in with Google
        </Button>
      </div>

      <Typography variant="subtitle1" textAlign="center" color="textSecondary">
        Don't have an account yet? <Link to="https://accounts.google.com" >Register</Link>
      </Typography>
    </>
  );
};

export default AuthLogin;
