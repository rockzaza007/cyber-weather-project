// api.js
import axios from 'axios';

const API_URL = 'http://localhost:9999/api/students';

const getToken = () => process.env.REACT_APP_STRAPI_API_TOKEN;

export const getStudents = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const addStudent = async (data) => {
  try {
    await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error adding student:', error);
  }
};

export const updateStudent = async (id, data) => {
  try {
    await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
  }
};

export const deleteStudent = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};
