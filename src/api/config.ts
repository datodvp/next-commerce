/**
 * API Configuration
 * Centralized configuration for API client
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3001',
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  apiVersion: 'v1',
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

