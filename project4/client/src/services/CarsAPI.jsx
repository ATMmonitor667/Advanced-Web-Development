const API_URL = 'http://localhost:3000/api'

const CarsAPI = {
  // Get all custom cars
  getAllCars: async () => {
    try {
      const response = await fetch(`${API_URL}/custom-items`)
      if (!response.ok) throw new Error('Failed to fetch cars')
      return await response.json()
    } catch (error) {
      console.error('Error fetching cars:', error)
      throw error
    }
  },

  // Get a single car by ID
  getCarById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/custom-items/${id}`)
      if (!response.ok) throw new Error('Failed to fetch car')
      return await response.json()
    } catch (error) {
      console.error('Error fetching car:', error)
      throw error
    }
  },

  // Create a new custom car
  createCar: async (carData) => {
    try {
      const response = await fetch(`${API_URL}/custom-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create car')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating car:', error)
      throw error
    }
  },

  // Update an existing car
  updateCar: async (id, carData) => {
    try {
      const response = await fetch(`${API_URL}/custom-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update car')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating car:', error)
      throw error
    }
  },

  // Delete a car
  deleteCar: async (id) => {
    try {
      const response = await fetch(`${API_URL}/custom-items/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete car')
      return await response.json()
    } catch (error) {
      console.error('Error deleting car:', error)
      throw error
    }
  },
}

export default CarsAPI
