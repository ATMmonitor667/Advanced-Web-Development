const API_BASE_URL = '/api';

// Get all custom cars
export const getAllCars = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`);
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

// Get a single car by ID
export const getCarById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching car ${id}:`, error);
    throw error;
  }
};

// Create a new custom car
export const createCar = async (carData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create car');
    }

    return data;
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
};

// Update an existing car
export const updateCar = async (id, carData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update car');
    }

    return data;
  } catch (error) {
    console.error(`Error updating car ${id}:`, error);
    throw error;
  }
};

// Delete a car
export const deleteCar = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete car');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting car ${id}:`, error);
    throw error;
  }
};

export default {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};
