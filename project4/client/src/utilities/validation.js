// Validate incompatible option combinations
export const validateSelections = (selections) => {
  const errors = []

  // Get option IDs from selections
  const optionIds = selections.map(s => s.option_id)

  // Rule 1: Electric engine (ID 13) cannot have sport wheels (ID 6)
  if (optionIds.includes(13) && optionIds.includes(6)) {
    errors.push('Electric engine is not compatible with sport wheels')
  }

  // Rule 2: All features must have a selection
  const requiredFeatures = [1, 2, 3, 4] // Exterior, Wheels, Interior, Engine
  const selectedFeatures = [...new Set(selections.map(s => s.feature_id))]

  requiredFeatures.forEach(featureId => {
    if (!selectedFeatures.includes(featureId)) {
      const featureNames = {
        1: 'Exterior Color',
        2: 'Wheels',
        3: 'Interior',
        4: 'Engine'
      }
      errors.push(`Please select ${featureNames[featureId]}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate car name
export const validateCarName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Car name is required' }
  }

  if (name.length < 3) {
    return { isValid: false, error: 'Car name must be at least 3 characters' }
  }

  if (name.length > 50) {
    return { isValid: false, error: 'Car name must be less than 50 characters' }
  }

  return { isValid: true }
}
