import axios from 'axios';

// Set the base URL of your feedback API
const BASE_URL = 'http://localhost:9999'; // Change this to your feedback API URL

const getToken = () => process.env.REACT_APP_STRAPI_API_TOKEN;

// Function to send feedback
export const sendFeedback = async (feedback) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/feedbacks`, { data : {text :feedback} }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFeedbacks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/feedbacks`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
    }
    catch (error) {
        throw error;
    }
}