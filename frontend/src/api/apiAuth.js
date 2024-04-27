import axios from 'axios';

// Set the base URL of your Strapi API
const BASE_URL = 'http://localhost:9999'; // Change this to your Strapi API URL

// Function to authenticate user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/local`, {
      identifier: email,
      password: password,
    });
    const { jwt, user } = response.data;
    
    // Store the JWT token in localStorage
    localStorage.setItem('token', jwt);
    // Optionally, you can store the user data as well
    localStorage.setItem('user', JSON.stringify(user));
    await getRoles();
    return { jwt, user };
  } catch (error) {
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/local/register`, {
      username: username,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (id, updatedUserData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/users/${id}`, updatedUserData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const role = response.data.role.name;
    console.log(role);
    localStorage.setItem('role', role);
    return response.data.role.name;
  } catch (error) {
    throw error;
  }
};  

// Function to logout user
export const logoutUser = async () => {
  try {
    // Clear the JWT token from localStorage
    localStorage.removeItem('token');
    // Optionally, clear the user data as well
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    return true;
  } catch (error) {
    throw error;
  }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  // Check if the JWT token exists in localStorage
  return !!localStorage.getItem('token');
};

export const isRoles = async () => {
  const existRole = !!localStorage.getItem('role');
  let role = "";
  if (existRole) {
    return localStorage.getItem('role');
  }
  return role;
}

// Function to get the current user
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/me?populate=photoURL`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
