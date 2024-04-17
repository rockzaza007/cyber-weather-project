import React, { useState } from 'react';
import { Typography, TextField, Button, Page } from '@mui/material';
import { sendFeedback } from 'src/api/apiFeedback'; // Import the sendFeedback function from apiFeedback.js
import PageContainer from 'src/components/container/PageContainer'; // นำเข้าคอมโพเนนต์ PageContainer
import DashboardCard from 'src/components/shared/DashboardCard';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await sendFeedback(feedback);
      // Optionally, you can show a success message to the user
      alert('Feedback sent successfully!');
      setFeedback(''); // Clear the feedback field after submission
    } catch (error) {
      console.error('Error sending feedback:', error);
      // Optionally, you can show an error message to the user
      alert('Error sending feedback. Please try again later.');
    }
  };

  return (
    <PageContainer title="Feedback" description="Feedback weather data for Thailand">
    <DashboardCard title="Feedback">
    <div>
      <TextField
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        label="Enter your feedback here"
        value={feedback}
        onChange={handleChange}
        margin='normal'
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
    </DashboardCard>
    </PageContainer>
  );
};

export default FeedbackPage;