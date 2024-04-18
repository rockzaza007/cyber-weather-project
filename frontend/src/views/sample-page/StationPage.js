import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, Modal, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { getStations, addStation, updateStation, deleteStation } from 'src/api/apiStation'; // Import functions from apiStation.js

const StationPage = () => {
    const [stations, setStations] = useState([]);
    const [newStationData, setNewStationData] = useState({ Name: '', Location: '', Serial: '', Tel: '', People: '', email: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedStationId, setSelectedStationId] = useState(null);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [stationToDeleteId, setStationToDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const stationData = await getStations();
            setStations(stationData.data); // Extract station data from the response
        } catch (error) {
            console.error('Error fetching stations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (editMode = false, stationId = null) => {
        setIsEdit(editMode);
        if (editMode) {
            const stationToEdit = stations.find(station => station.id === stationId);
            setNewStationData({
                Name: stationToEdit.attributes.Name,
                Location: stationToEdit.attributes.Location,
                Serial: stationToEdit.attributes.Serial,
                Tel: stationToEdit.attributes.Tel,
                People: stationToEdit.attributes.People,
                email: stationToEdit.attributes.email
            });
            setSelectedStationId(stationId);
        } else {
            setNewStationData({ Name: '', Location: '', Serial: '', Tel: '', People: '', email: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setIsEdit(false);
        setSelectedStationId(null);
    };

    const handleAddOrUpdateStation = async () => {

        if (!newStationData.Name || !newStationData.Tel || !newStationData.email) {
            alert('Name, Tel, and Email are required fields.');
            return; // Stop execution if required fields are empty
        }

        // Check if the email field matches the email format using regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newStationData.email)) {
            alert('Please enter a valid email address.');
            return; // Stop execution if email format is invalid
        }
        
        const telRegex = /^\d{10}$/; // Assuming telephone number is 10 digits long
        if (!telRegex.test(newStationData.Tel)) {
            alert('Please enter a valid telephone number (10 digits without spaces or special characters).');
            return; // Stop execution if telephone number format is invalid
        }
        
        if (isEdit && selectedStationId) {
            try {
                await updateStation(selectedStationId, { data: newStationData });
            } catch (error) {
                console.error('Error updating station:', error);
            }
        } else {
            try {
                await addStation({ data: newStationData });
            } catch (error) {
                console.error('Error adding station:', error);
            }
        }
        fetchData();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        setStationToDeleteId(id);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await deleteStation(stationToDeleteId);
        } catch (error) {
            console.error('Error deleting station:', error);
        }
        fetchData();
        setDeleteConfirmationOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStationData({ ...newStationData, [name]: value });
    };

    return (
        <PageContainer title="Station Management" description="Manage users">
            <DashboardCard title="Station Management">
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Station</Button>
                    </div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Serial</TableCell>
                                <TableCell>Tel</TableCell>
                                <TableCell>People</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stations.map(station => (
                                <TableRow key={station.id}>
                                    <TableCell>{station.attributes.Name}</TableCell>
                                    <TableCell>{station.attributes.Location}</TableCell>
                                    <TableCell>{station.attributes.Serial}</TableCell>
                                    <TableCell>{station.attributes.Tel}</TableCell>
                                    <TableCell>{station.attributes.People}</TableCell>
                                    <TableCell>{station.attributes.email}</TableCell>
                                    <TableCell>
                                        <Button style={{ marginRight: "1vw" }} variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenModal(true, station.id)}>Edit</Button>
                                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(station.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Modal open={modalOpen} onClose={handleCloseModal} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
                    }}>
                        <div style={{ backgroundColor: "white", padding: "3%", borderRadius: "12px", width: "30vw" }}>
                            <Typography variant="h6">{isEdit ? 'Edit Station' : 'Add Station'}</Typography>
                            <TextField
                                required
                                name="Name"
                                label="Name"
                                value={newStationData.Name}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                sx={{ width: "100%" }}
                            />
                            <TextField
                                name="Location"
                                label="Location"
                                value={newStationData.Location}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                sx={{ width: "100%" }}
                            />
                            <TextField
                                name="Serial"
                                label="Serial"
                                value={newStationData.Serial}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                sx={{ width: "100%" }}
                            />
                            <TextField
                                required
                                name="Tel"
                                label="Tel"
                                value={newStationData.Tel}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                sx={{ width: "100%" }}
                            />
                            <TextField
                                name="People"
                                label="People"
                                value={newStationData.People}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                sx={{ width: "100%" }}
                            />
                            <TextField
                                required
                                name="email"
                                label="Email"
                                value={newStationData.email}
                                onChange={handleChange}
                                variant="outlined"
                                margin="normal"
                                type="email"
                                sx={{ width: "100%" }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button variant="contained" color="primary" onClick={handleAddOrUpdateStation}>{isEdit ? 'Update' : 'Add'}</Button>
                                <Button variant="contained" color="error" style={{ marginLeft: "1vw" }} onClick={handleCloseModal}>Cancel</Button>
                            </div>

                        </div>
                    </Modal>
                    <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
                        <DialogTitle>Delete Station</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this station?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
                            <Button onClick={handleDeleteConfirmation}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </DashboardCard>
        </PageContainer>
    );
};

export default StationPage;
