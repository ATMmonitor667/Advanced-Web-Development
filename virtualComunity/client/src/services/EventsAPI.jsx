const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

// Get events by location ID
export const getEventsByLocation = async (locationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${locationId}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events for location');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching events for location ${locationId}:`, error);
    throw error;
  }
};

export default {
  getAllEvents,
  getEventById,
  getEventsByLocation
};