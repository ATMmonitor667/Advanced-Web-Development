const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get all locations
export const getAllLocations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// Get a single location by ID
export const getLocationById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching location ${id}:`, error);
    throw error;
  }
};

export default {
  getAllLocations,
  getLocationById
};