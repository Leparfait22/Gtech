export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '0'
  
  // Format with a dot for thousands and no decimal places (if integer)
  // or with comma for decimal places.
  // Using pt-BR or de-DE is a common way to get 150.000,00 format.
  // The user requested 150000 -> 150.000, 22500 -> 22.500
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num)
}
