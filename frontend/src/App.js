import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import isAuthenticated from './routes/Router'; // Import the isAuthenticated function

import { baselightTheme } from "./theme/DefaultColors";

function App() {
  const theme = baselightTheme;
  const routing = useRoutes(isAuthenticated()); // Pass the result of isAuthenticated to useRoutes
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default App;
