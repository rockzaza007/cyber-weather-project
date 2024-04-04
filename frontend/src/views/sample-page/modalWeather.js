import React, { useState, useEffect } from 'react';
import { Modal, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase_config';
import e from 'cors';

const CustomModal = ({ open, handleClose, isEdit, entryId, fetchData }) => {
  const [newWeatherEntry, setNewWeatherEntry] = useState({ province: '', humidity: '', temperature: '' });
  const [loading, setLoading] = useState(false);

  console.log('fetch : ', fetchData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWeatherEntry({ ...newWeatherEntry, [name]: value });
  };
  
  const handleAddOrUpdateEntry = async () => {
    setLoading(true);
    if (isEdit && entryId) {
      const entryRef = doc(db, 'weatherData', entryId);
      await updateDoc(entryRef, newWeatherEntry);
    } else {
      await addDoc(collection(db, 'weatherData'), newWeatherEntry);
    }
    fetchData();
    setLoading(false);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ backgroundColor: "white", padding: "5%", borderRadius: "12px" }}>
        <Typography variant="h6">{isEdit ? 'Edit Weather' : 'Add Weather'}</Typography>
        <div>
        <TextField
          name="province"
          label="จังหวัด"
          value={newWeatherEntry.province}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        </div>
        <TextField
          name="humidity"
          label="ความชื้น"
          value={newWeatherEntry.humidity}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <TextField
          name="temperature"
          label="อุณหภูมิ"
          value={newWeatherEntry.temperature}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddOrUpdateEntry} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Add')}
        </Button>
      </div>
    </Modal>
  );
};

export default CustomModal;
