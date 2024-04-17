import axios from 'axios';

const BASE_URL = 'http://localhost:9999/api';

const getToken = () => process.env.REACT_APP_STRAPI_API_TOKEN;

export const getStations = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/stations`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addStation = async (stationData) => {
    try {
        await axios.post(`${BASE_URL}/stations`, stationData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
    } catch (error) {
        throw error;
    }
};

export const updateStation = async (stationId, updatedStationData) => {
    try {
        await axios.put(`${BASE_URL}/stations/${stationId}`, updatedStationData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
    } catch (error) {
        throw error;
    }
};

export const deleteStation = async (stationId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/stations/${stationId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }

        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
