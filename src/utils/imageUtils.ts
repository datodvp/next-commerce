import { API_CONFIG } from '@/api/config'

/**
 * Normalizes an image URL to ensure it's absolute
 * @param url - The image URL (can be relative or absolute)
 * @returns The absolute image URL
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return ''
  return url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`
}

/**
 * Gets the first image URL from a product's images array
 * @param images - Array of image objects with url property
 * @returns The normalized first image URL or null
 */
export const getFirstImageUrl = (
  images?: Array<{ url: string; [key: string]: unknown }>,
): string | null => {
  if (!images || images.length === 0) return null
  const firstImage = images[0]?.url
  return firstImage ? normalizeImageUrl(firstImage) : null
}
