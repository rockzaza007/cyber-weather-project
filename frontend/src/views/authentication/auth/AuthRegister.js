import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { registerUser } from '../../../api/apiAuth'; // Import the registerUser function

const AuthRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the registerUser function from apiAuth.js
      const data = await registerUser(formData.username, formData.email, formData.password);

      // Handle response data
      navigate('/auth/login')
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Typography fontWeight="700" variant="h2" mb={1} style={{ textAlign: "center" }}>
        Register
      </Typography>

      <form onSubmit={handleSubmit}>
        <CustomTextField
          id="username"
          name="username"
          label="Username"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.username}
          onChange={handleChange}
        />
        <CustomTextField
          id="email"
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <CustomTextField
          id="password"
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />

        <Button  variant="contained" size="large" fullWidth type="submit" color='success'>
          Sign Up
        </Button>
      </form>
      <hr />
      <Typography variant="subtitle1" textAlign="center" color="textSecondary">
        Already have an account? 
        <Typography
          component={Link}
          to="/auth/login"
          fontWeight="500"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
          }}
          style={{ marginLeft: '4px' }}
        >
          Sign in
        </Typography>
      </Typography>
    </>
  );
};

export default AuthRegister;
