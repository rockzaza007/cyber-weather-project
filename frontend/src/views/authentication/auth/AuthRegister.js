import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthRegister = () => {
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
      const response = await fetch('http://localhost:9999/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle response data
      console.log(data); // For testing purposes
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Typography fontWeight="700" variant="h2" mb={1}>
        Register
      </Typography>

      <form onSubmit={handleSubmit}>
        <CustomTextField
          id="username"
          name="username"
          label="Username"
          variant="outlined"
          fullWidth
          value={formData.username}
          onChange={handleChange}
        />{' '}
        <br />
        <CustomTextField
          id="email"
          name="email"
          label="Email"
          type="email"
          variant="outlined"
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
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />
        <Button color="primary" variant="contained" size="large" fullWidth type="submit">
          Sign Up
        </Button>
      </form>

      <Typography variant="subtitle1" textAlign="center" color="textSecondary">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </>
  );
};

export default AuthRegister;
