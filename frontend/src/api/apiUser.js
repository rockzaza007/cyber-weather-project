// apiUser.js
import axios from 'axios';

const API_URL = 'http://localhost:9999/api'; // Update with your Strapi API URL

const getToken = () => localStorage.getItem('token'); // Retrieve JWT token from local storage

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users?populate=role`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
};

export const addUser = async (userData) => {
  try {
    await axios.post(`${API_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    await axios.put(`${API_URL}/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
