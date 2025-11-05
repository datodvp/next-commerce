/**
 * API Configuration
 * Centralized configuration for API client
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3001',
  timeout: 10000, // 30 seconds
  retries: 2,
  retryDelay: 1000, // 1 second
} as const

export const API_ENDPOINTS = {
  PRODUCTS: {
    BASE: '/products',
    BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    BY_CATEGORY: (categoryId: number) => `/products/category/${categoryId}`,
  },
  CATEGORIES: {
    BASE: '/categories',
  },
} as const

