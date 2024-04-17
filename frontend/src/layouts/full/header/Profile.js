import React, { useState, useEffect } from 'react';
import { Avatar, Box, Menu, Button, Typography, Divider, IconButton } from '@mui/material';
import { signOut } from "firebase/auth";
import auth from '../../../firebase_config';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../../api/apiAuth'; // Import the getCurrentUser and logoutUser functions from apiAuth.js

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [strapiUser, setStrapiUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setStrapiUser(user);
      } catch (error) {
        console.error('Error fetching user data from Strapi:', error);
      }
    };

    if (!auth.currentUser) {
      fetchUser();
    }
  }, []);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleSignOut = async () => {
    try {
      await logoutUser(); // Logout from Strapi
      await signOut(auth); // Logout from Firebase
      navigate('/auth/login'); // Navigate to login page after signing out
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // console.log(strapiUser.photoURL);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
      >
        <Avatar
          src={strapiUser?.photoURL?.url ? `http://localhost:9999${strapiUser.photoURL.url}` : auth.currentUser?.photoURL || null}
          alt={strapiUser?.username || auth.currentUser?.displayName || ''}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

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
        {strapiUser ? (
          <div style={{ padding: "7%", textAlign: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={strapiUser.photoURL?.url ? `http://localhost:9999${strapiUser.photoURL.url}` : null}
                alt={strapiUser.username}
                sx={{
                  width: 85,
                  height: 85,
                  border: '2px solid #fff',
                  borderRadius: '50%',
                }}
              />
            </div>
            <Typography variant="subtitle1">
              {strapiUser.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {strapiUser.email}
            </Typography>
          </div>
        ) :
          <div style={{ padding: "7%", textAlign: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={auth.currentUser ? auth.currentUser.photoURL : null}
                alt={auth.currentUser ? auth.currentUser.displayName : ''}
                sx={{
                  width: 85,
                  height: 85,
                  border: '2px solid #fff',
                  borderRadius: '50%',
                }}
              />
            </div>
            <Typography variant="subtitle1">
              {auth.currentUser ? auth.currentUser.displayName : ''}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {auth.currentUser ? auth.currentUser.email : ''}
            </Typography>
          </div>
        }
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
