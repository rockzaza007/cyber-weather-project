import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import auth from '../../../firebase_config';
import { useNavigate } from 'react-router';
import { getCurrentUser, isAuthenticated, logoutUser } from 'src/api/apiAuth'; // Import the required functions from apiAuth.js

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons';

const Header = (props) => {
  const navigate = useNavigate();
  const [strapiUser, setStrapiUser] = useState({}); // Initialize as empty object
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        // Transform the user data to match the expected format
        setStrapiUser(user);
      } catch (error) {
        console.error('Error fetching user data from Strapi:', error);
      }
    };

    if (!auth.currentUser) {
      fetchUser();
    }
  }, []);

  const handleUserActivity = () => {
    localStorage.setItem('lastActivity', Date.now());
  };

  const checkSessionExpiration = () => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const elapsedTime = Date.now() - parseInt(lastActivity);
      const sessionExpirationTime = 30 * 60 * 1000; // 30 minutes in milliseconds
      if (elapsedTime >= sessionExpirationTime) {
        setShowModal(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    const interval = setInterval(checkSessionExpiration, 60000); // Check every minute
    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      clearInterval(interval);
    };
  }, []);

  const logoutAndCloseModal = () => {
    logoutUser();
    setShowModal(false);
    navigate('/auth/login');
  };

  const logoutAndCloseModalOnBackdropClick = () => {
    logoutUser();
    setShowModal(false);
    navigate('/auth/login');
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

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
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <span style={{
            fontFamily: "'Poppins', sans-serif", // Example font
            fontSize: '18px',
            color: '#4caf50', // Example color
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
          }}>
            Welcome {auth.currentUser ? auth.currentUser.displayName : strapiUser.username}
          </span>
          <Profile />
        </Stack>
      </ToolbarStyled>

      {/* Notification Modal */}
      <Modal
        open={showModal}
        onClose={logoutAndCloseModal}
        aria-labelledby="session-expiration-modal"
        aria-describedby="session-expiration-modal-description"
        BackdropProps={{
          onClick: logoutAndCloseModalOnBackdropClick,
        }}
        style={{ borderRadius: '8px'}}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          alignItems: 'center',
        }}>
          <Typography id="session-expiration-modal" variant="h5" component="h2" gutterBottom>
            Session Expiration
          </Typography>
          <Typography id="session-expiration-modal-description" variant="body1" gutterBottom>
            Your session has expired. Please log in again.
          </Typography>
          <Button onClick={logoutAndCloseModal} variant="contained" color="primary">
            Log In
          </Button>
        </Box>
      </Modal>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
