const API_URL = 'http://localhost:3000/api'

const OptionsAPI = {
  // Get all features with their options
  getAllFeaturesWithOptions: async () => {
    try {
      const response = await fetch(`${API_URL}/options/features`)
      if (!response.ok) throw new Error('Failed to fetch features')
      return await response.json()
    } catch (error) {
      console.error('Error fetching features:', error)
      throw error
    }
  },

  // Get all options
  getAllOptions: async () => {
    try {
      const response = await fetch(`${API_URL}/options`)
      if (!response.ok) throw new Error('Failed to fetch options')
      return await response.json()
    } catch (error) {
      console.error('Error fetching options:', error)
      throw error
    }
  },

  // Get options by feature ID
  getOptionsByFeature: async (featureId) => {
    try {
      const response = await fetch(`${API_URL}/options/feature/${featureId}`)
      if (!response.ok) throw new Error('Failed to fetch options')
      return await response.json()
    } catch (error) {
      console.error('Error fetching options:', error)
      throw error
    }
  },
}

export default OptionsAPI
