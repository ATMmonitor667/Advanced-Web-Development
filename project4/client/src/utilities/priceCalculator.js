// Base price of the car
const BASE_PRICE = 40000;

// Calculate total price based on selected options
export const calculateTotalPrice = (exterior, roof, wheels, interior) => {
  const exteriorPrice = exterior?.price || 0;
  const roofPrice = roof?.price || 0;
  const wheelsPrice = wheels?.price || 0;
  const interiorPrice = interior?.price || 0;

  return BASE_PRICE + exteriorPrice + roofPrice + wheelsPrice + interiorPrice;
};

// Format price as currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default {
  calculateTotalPrice,
  formatPrice,
  BASE_PRICE
};
