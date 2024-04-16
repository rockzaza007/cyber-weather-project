import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import auth from '../../../firebase_config';
import { getCurrentUser ,isAuthenticated} from 'src/api/apiAuth'; // Import the getCurrentUser function from apiAuth.js

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons';
import { a } from 'react-spring';

const Header = (props) => {
  const [strapiUser, setStrapiUser] = useState({}); // Initialize as empty object

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
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
