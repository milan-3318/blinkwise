import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getProfile = async (email) => {
  try {
    const response = await axios.get(`${API_BASE}/profile`, { params: { email } });
    return response.data;
  } catch (error) {
    console.warn('Backend offline or user not found');
    return null;
  }
};

export const saveProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_BASE}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const saveSession = async (email, sessionData) => {
  try {
    const response = await axios.post(`${API_BASE}/sessions`, { email, ...sessionData });
    return response.data;
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const getSessions = async (email) => {
  try {
    const response = await axios.get(`${API_BASE}/sessions`, { params: { email } });
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};
