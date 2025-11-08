/**
 * Formats a price value to 2 decimal places
 * @param price - The price value to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

/**
 * Formats a price with dollar sign
 * @param price - The price value to format
 * @returns Formatted price string with $ prefix
 */
export const formatPriceWithCurrency = (price: number): string => {
  return `$${formatPrice(price)}`
}

