/**
 * URL Validation Utility
 * Validates image URLs
 */

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString)
    // Check if it's http or https
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates if a URL points to an image
 * Checks common image extensions
 */
export const isImageUrl = (urlString: string): boolean => {
  if (!isValidUrl(urlString)) {
    return false
  }

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico']
  const lowerUrl = urlString.toLowerCase()
  
  // Check if URL ends with image extension or contains image-related paths
  return imageExtensions.some((ext) => lowerUrl.includes(ext)) || 
         lowerUrl.includes('/image') || 
         lowerUrl.includes('/img') ||
         lowerUrl.includes('/photo')
}

/**
 * Validates and normalizes a URL
 * Returns the validated URL or null if invalid
 */
export const validateAndNormalizeUrl = (urlString: string): string | null => {
  const trimmed = urlString.trim()
  
  if (!trimmed) {
    return null
  }

  // If it doesn't start with http, try to add it
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    const withProtocol = `https://${trimmed}`
    if (isValidUrl(withProtocol)) {
      return withProtocol
    }
  }

  if (isValidUrl(trimmed)) {
    return trimmed
  }

  return null
}

