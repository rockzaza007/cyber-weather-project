import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, Modal, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { getUsers, addUser, updateUser, deleteUser } from 'src/api/apiUser'; // Import functions from api.js
import { Telegram } from '@mui/icons-material';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [newUserData, setNewUserData] = useState({ name: '', email: '', role: '', tel: ''});
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const userData = await getUsers();
            setUsers(userData.data); // Extract user data from the response
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (editMode = false, userId = null) => {
        setIsEdit(editMode);
        if (editMode) {
            const userToEdit = users.find(user => user.id === userId);
            setNewUserData({
                name: userToEdit.attributes.name,
                email: userToEdit.attributes.email,
                role: userToEdit.attributes.role,
                tel : userToEdit.attributes.tel
            });
            setSelectedUserId(userId);
        } else {
            setNewUserData({ name: '', email: '', role: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setIsEdit(false);
        setSelectedUserId(null);
    };

    const handleAddOrUpdateUser = async () => {
        if (isEdit && selectedUserId) {
            try {
                await updateUser(selectedUserId, newUserData);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            try {
                await addUser(newUserData);
            } catch (error) {
                console.error('Error adding user:', error);
            }
        }
        fetchData();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        setUserToDeleteId(id);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await deleteUser(userToDeleteId);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        fetchData();
        setDeleteConfirmationOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserData({ ...newUserData, [name]: value });
    };

    return (
        <PageContainer title="User Management" description="Manage users">
            <DashboardCard title="User Role">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Entry</Button>
                </div>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Tel</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.attributes.name}</TableCell>
                                    <TableCell>{user.attributes.email}</TableCell>
                                    <TableCell>{user.attributes.role}</TableCell>
                                    <TableCell>{user.attributes.tel}</TableCell>
                                    <TableCell>
                                        <Button style={{ marginRight: "1vw" }} variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenModal(true, user.id)}>Edit</Button>
                                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(user.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DashboardCard>
            <Modal open={modalOpen} onClose={handleCloseModal} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
            }}>
                <div style={{ backgroundColor: "white", padding: "3%", borderRadius: "12px", width: "30vw" }}>
                    <Typography variant="h6">{isEdit ? 'Edit User' : 'Add User'}</Typography>
                    <TextField
                        name="name"
                        label="Name"
                        value={newUserData.name}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        sx={{ width: "100%" }}
                    /><br />
                    <TextField
                        name="email"
                        label="Email"
                        value={newUserData.email}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        sx={{ width: "100%" }}
                    /><br />
                    <TextField
                        name="role"
                        label="Role"
                        select
                        value={newUserData.role}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </TextField><br />
                    <TextField
                        name="tel"
                        label="tel"
                        value={newUserData.tel}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        maxLength="10"
                        minLength="10"
                        sx={{ width: "100%"}}
                    /><br />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" color="primary" onClick={handleAddOrUpdateUser}>{isEdit ? "Update" : "Add"}</Button>
                    </div>
                </div>
            </Modal>
            <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirmation} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default AdminPage;
