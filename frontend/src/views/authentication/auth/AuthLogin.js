import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from '../../../firebase_config'; // Import Firebase Authentication
import './google.css' // Import Google Sign-In Button CSS
import GoogleIcon from '@mui/icons-material/Google'; // Import Google Icon
import { loginUser } from '../../../api/apiAuth'; // Import loginUser function from apiAuth.js
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


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
  // Handle Strapi Login
  const handleStrapiLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Call the loginUser function from apiAuth.js
      const response = await loginUser(email, password);
      // Redirect to Dashboard after successful authentication  
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Typography fontWeight="700" variant="h2" mb={1} style={{ textAlign: "center" }}>
        Sign in
      </Typography>
      {/* Strapi Sign-In Form */}
      <form onSubmit={handleStrapiLogin}>
        <CustomTextField
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomTextField
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          Sign in
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>
      <hr />
      <Typography variant="subtitle1" textAlign="center" color="textSecondary"> OR </Typography>
      {/* Google Sign-In Button */}
      <div className="button-container">
        <Button
          variant="contained"
          onClick={handleGoogleSignIn}
          className="google-login-button"
          color='error'
        >
          <GoogleIcon sx={{ marginRight: '8px' }} />
          Sign in with Google
        </Button>
      </div>

      <Typography variant="subtitle1" textAlign="center" color="textSecondary">
        Don't have an account yet? 
        <Typography
          component={Link}
          to="/auth/register"
          fontWeight="500"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
          }}
          style={{ marginLeft: '4px' }}
        >
          Create an account
        </Typography>
      </Typography>
    </>
  );
};

export default AuthLogin;
