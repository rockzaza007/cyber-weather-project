import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/404-error-idea.gif';
import auth from 'src/firebase_config';

const Error = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Check if user is already logged in    
    // Run the code every 1 second
    const interval = setInterval(() => {
      if (auth.currentUser) {
        console.log('User is already logged in');
        // Redirect to Dashboard
        navigate('/dashboard');
      }
    }, 0);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [])


  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      textAlign="center"
      justifyContent="center"
    >
      <Container maxWidth="md">
        <img src={ErrorImg} alt="404" style={{ width: '100%', maxWidth: '500px' }} />
        <Typography align="center" variant="h1" mb={4}>
          Opps!!!
        </Typography>
        <Typography align="center" variant="h4" mb={4}>
          This page you are looking for could not be found.
        </Typography>
        <Button color="primary" variant="contained" component={Link} to="/" disableElevation>
          Go Back to Home
        </Button>
      </Container>
    </Box>
  );
};

export default Error;
