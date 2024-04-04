import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  Typography,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { signOut } from "firebase/auth";
import auth from '../../../firebase_config';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/auth/login'); // Navigate to login page after signing out
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={auth.currentUser ? auth.currentUser.photoURL : null}
          alt={auth.currentUser ? auth.currentUser.displayName : ''}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Profile Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '20vw',
          },
        }}
      >
        {auth.currentUser && (
          
          <div style={{padding:"7%", textAlign:'center',alignItems: 'center'}}>
            <div style={{display:'flex', justifyContent:'center'}}>
            <Avatar
  src={auth.currentUser ? auth.currentUser.photoURL : null}
  alt={auth.currentUser ? auth.currentUser.displayName : ''}
  sx={{
    width: 85,
    height: 85,
    border: '2px solid #fff', // White border around the avatar
    borderRadius: '50%', // Make the avatar rounded
  }}
/>
</div>
            <Typography variant="subtitle1">
              {auth.currentUser.displayName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {auth.currentUser.email}
            </Typography>
          </div>
        )}
        <Box mt={1} py={1} px={2}>
        <Divider />
          <Button onClick={handleSignOut} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
