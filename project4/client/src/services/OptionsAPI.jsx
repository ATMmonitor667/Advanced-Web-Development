const API_BASE_URL = '/api';

// Get all exterior options
export const getAllExteriors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/exteriors`);
    if (!response.ok) {
      throw new Error('Failed to fetch exteriors');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching exteriors:', error);
    throw error;
  }
};

// Get all roof options
export const getAllRoofs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/roofs`);
    if (!response.ok) {
      throw new Error('Failed to fetch roofs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching roofs:', error);
    throw error;
  }
};

// Get all wheel options
export const getAllWheels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/wheels`);
    if (!response.ok) {
      throw new Error('Failed to fetch wheels');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching wheels:', error);
    throw error;
  }
};

// Get all interior options
export const getAllInteriors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/interiors`);
    if (!response.ok) {
      throw new Error('Failed to fetch interiors');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching interiors:', error);
    throw error;
  }
};

export default {
  getAllExteriors,
  getAllRoofs,
  getAllWheels,
  getAllInteriors
};
