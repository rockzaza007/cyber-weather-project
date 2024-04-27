import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, Modal, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { getUsers, addUser, updateUser, deleteUser } from 'src/api/apiUser'; // Import functions from api.js
import { Password, Telegram } from '@mui/icons-material';
import auth from 'src/firebase_config';
import { isRoles } from 'src/api/apiAuth';
import { is } from '@react-spring/shared';

const AdminPage = () => {
    const [users, setUsers] = useState({});
    const [newUserData, setNewUserData] = useState({ username: '', email: '', password: '', confirmed: '', blocked: '', role: '' });
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
            setUsers(userData); // Extract user data from the response
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
                name: userToEdit.username,
                email: userToEdit.email,
                password: userToEdit.password,
                confirmed: userToEdit.confirmed,
                blocked: userToEdit.blocked,
                role: userToEdit.role.id
            });
            setSelectedUserId(userId);
        } else {
            setNewUserData({ username: '', email: '', confirmed: '', blocked: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setIsEdit(false);
        setSelectedUserId(null);
    };

    const handleAddOrUpdateUser = async () => {

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Check if password meets the criteria
        if (!passwordRegex.test(newUserData.password)) {
            alert("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.");
            return;
        }

        if (isEdit && selectedUserId) {
            try {
                await updateUser(selectedUserId, newUserData);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            try {
                const userData = { ...newUserData };
                if (userData.role) {
                    userData.role = {
                        connect: [{ id: userData.role }] // Assuming role ID is provided in the newUserData
                    };
                }
                await addUser(userData);
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

    const role = () => {
        if (localStorage.getItem('role') === 'Super-Admin') {
            return 'Super-Admin';
        }
    };

    const roleOptions = [
        { value: '1', label: 'Authenticated' },
        { value: '2', label: 'Public' },
        { value: '3', label: 'Super-Admin' },
        { value: '4', label: 'Default-Admin' }
    ];

    const isAdminEmail = role() === 'Super-Admin';

    return (

        <PageContainer title="User Management" description="Manage users">
            {isAdminEmail ? (
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
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Confirmed</TableCell>
                                    <TableCell>Blocked</TableCell>
                                    <TableCell>Update at</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            {users && users.length > 0 ? (
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.provider}</TableCell>
                                            <TableCell sx={{ fontSize: "2rem" }}>{user.confirmed ? "✅" : "❌"}</TableCell>
                                            <TableCell sx={{ fontSize: "2rem" }}>{user.blocked ? "⛔" : ""}</TableCell>
                                            <TableCell>{user.updatedAt}</TableCell>
                                            <TableCell>
                                                <Button style={{ marginRight: "1vw" }} variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenModal(true, user.id)}>Edit</Button>
                                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(user.id)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            ) : (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ textAlign: 'center' }}>No users found</TableCell>
                                    </TableRow>
                                </TableBody>
                            )}
                        </Table>
                    )}
                </DashboardCard>
            ) : (
                <div style={{ position: "fixed", left: "45%", textAlign: "center", border: "2px solid red", width: "30%", padding: "10px", borderRadius: "8px", backgroundColor: "red", color: "white" }}>
                    <Typography variant="h1">!</Typography>
                    <Typography variant="h1">You are not Admin</Typography>
                </div>
            )}
            <Modal open={modalOpen} onClose={handleCloseModal} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
            }}>
                <div style={{ backgroundColor: "white", padding: "3%", borderRadius: "12px", width: "30vw" }}>
                    <Typography variant="h6">{isEdit ? 'Edit User' : 'Add User'}</Typography>
                    <TextField
                        name="username"
                        label="Username"
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
                    {isEdit ? (
                        <TextField
                            name="password"
                            label="Password"
                            value={newUserData.password}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                            sx={{ width: "100%" }}
                        >
                            <br />
                        </TextField>
                    ) : (
                        <TextField
                            name="password"
                            label="Password"
                            value={newUserData.password}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                            sx={{ width: "100%" }}
                        >
                            <br />
                        </TextField>
                    )}

                    <TextField
                        name="confirmed"
                        label="Confirmed"
                        select
                        value={newUserData.confirmed}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value="true">true</MenuItem>
                        <MenuItem value="false">false</MenuItem>
                    </TextField><br />
                    <TextField
                        name="blocked"
                        label="Blocked"
                        select
                        value={newUserData.blocked}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        maxLength="10"
                        minLength="10"
                        sx={{ width: "100%" }}
                    >
                        <MenuItem value="true">Blocked</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                    </TextField>

                    {isEdit ? (
                        <TextField
                            disabled
                            name="role"
                            label="Role"
                            select
                            value={newUserData.role}
                            variant="outlined"
                            margin="normal"
                            maxLength="10"
                            minLength="10"
                            sx={{ width: "100%" }}
                        >
                            {roleOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <TextField
                            name="role"
                            label="Role"
                            select
                            value={newUserData.role}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                            maxLength="10"
                            minLength="10"
                            sx={{ width: "100%" }}
                        >
                            {roleOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <br />
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
