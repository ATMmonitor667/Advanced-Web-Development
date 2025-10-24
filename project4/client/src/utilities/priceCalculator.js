// Calculate total price from selections
export const calculateTotalPrice = (selections) => {
  if (!selections || selections.length === 0) return 0

  return selections.reduce((total, selection) => {
    return total + (parseFloat(selection.price) || 0)
  }, 0)
}

// Format price for display
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}
