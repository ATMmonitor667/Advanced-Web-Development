// Validate that the selected combination is valid
export const validateCarConfiguration = (exterior, roof, wheels, interior) => {
  const errors = [];

  // Check if all required fields are selected
  if (!exterior) errors.push('Please select an exterior color');
  if (!roof) errors.push('Please select a roof type');
  if (!wheels) errors.push('Please select wheels');
  if (!interior) errors.push('Please select an interior');

  // Check for incompatible combinations
  // Convertible roofs cannot have sunroof options
  if (roof && roof.convertible && (roof.type === 'sunroof' || roof.type === 'panoramic')) {
    errors.push('Invalid combination: Convertible roofs cannot have sunroof options');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Check if a specific combination is incompatible
export const isIncompatibleCombination = (roof) => {
  if (roof && roof.convertible && (roof.id === 2 || roof.id === 3)) {
    return true;
  }
  return false;
};

export default {
  validateCarConfiguration,
  isIncompatibleCombination
};
