import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import auth from 'src/firebase_config';
import { isAuthenticated } from 'src/api/apiAuth';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;

  const isLoggedIn = !!auth.currentUser; // Check if the user is logged in
  const strapiIsAuthenticated = isAuthenticated(); // Check if the user is authenticated

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {

          if (item.title === 'Role' && !isLoggedIn) {
            return null; // Don't render the item
          }
          if (item.title === 'Profile' && !strapiIsAuthenticated) {
            return null; // Don't render the item
          }
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
