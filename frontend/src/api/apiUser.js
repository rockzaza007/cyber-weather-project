// api.js
import axios from 'axios';

const API_URL = 'http://localhost:9999/api/weather-authorizations';

const getToken = () => process.env.REACT_APP_STRAPI_API_TOKEN;

export const getUsers = async () => {
  //console.log('KEY:', getToken());
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const addUser = async (data) => {
  try {
    await axios.post(API_URL, { data }, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error adding student:', error);
  }
};

export const updateUser = async (id, data) => {
  try {
    await axios.put(`${API_URL}/${id}`, { data }, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
  }
};

export const deleteUser = async (id) => {
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
