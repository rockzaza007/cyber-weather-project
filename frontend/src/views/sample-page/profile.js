import React, { useState, useEffect } from 'react';
import { Typography, Button, Avatar, Grid, TextField, Container, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { getCurrentUser, updateUserProfile } from 'src/api/apiAuth'; // Import the getCurrentUser and updateUserProfile functions from apiAuth.js
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
                setEditedUser(currentUser);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const handleEditClick = () => {
        setOpenEditModal(true);
    };

    const handleSaveClick = async () => {
        try {
            // Call the updateUserProfile function with the edited user data
            await updateUserProfile(user.id, editedUser);
            // Update the user state with the edited data
            setUser(editedUser);
            setOpenEditModal(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setEditedUser({
                ...editedUser,
                photoURL: {
                    url: `http://localhost:9999${reader.result}`,
                    formats: {
                        thumbnail: {
                            url: `http://localhost:9999${reader.result}`,
                        }
                    }
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            {user && (
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <label htmlFor="upload-photo">
                            <Avatar src={editedUser.photoURL ? `http://localhost:9999${editedUser.photoURL.url}` : user.photoURL ? `http://localhost:9999${user.photoURL.url}` : null} alt={user.displayName} sx={{ width: 200, height: 200 }} />
                            <input
                                id="upload-photo"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Box display="flex" alignItems="center">
                            <CustomTextField
                                InputProps={{
                                    readOnly: true,
                                }}
                                type="username"
                                label="username"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={user.username}
                            />
                        </Box>
                        <Box display="flex" alignItems="center">
                            <CustomTextField
                                InputProps={{
                                    readOnly: true,
                                }}
                                type="username"
                                label="username"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                value={user.email}
                            />
                        </Box>
                        <Box mt={2}>
                            <IconButton onClick={handleEditClick} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            )}

            {/* Edit Modal */}
            <Dialog open={openEditModal} onClose={handleCloseEditModal}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        name="username"
                        label="Username"
                        value={editedUser?.username || ''}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        mb={2}
                        margin='normal'
                    />
                    <TextField
                        name="email"
                        label="Email"
                        type="email"
                        value={editedUser?.email || ''}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        mb={2}
                        margin='normal'
                    />
                    {/* <TextField
                        name="bio"
                        label="Bio"
                        multiline
                        rows={4}
                        value={editedUser?.bio || ''}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        margin='normal'
                    /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal} color="primary" startIcon={<CloseIcon />}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveClick} color="primary" startIcon={<SaveIcon />}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfilePage;
