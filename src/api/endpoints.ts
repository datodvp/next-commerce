/**
 * API Endpoints
 * Type-safe endpoint definitions
 */

import { API_ENDPOINTS } from './config'

export const endpoints = {
  products: {
    getAll: () => API_ENDPOINTS.PRODUCTS.BASE,
    getBySlug: (slug: string) => API_ENDPOINTS.PRODUCTS.BY_SLUG(slug),
    getByCategory: (categoryId: number) =>
      API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId),
    search: (query: string) => API_ENDPOINTS.PRODUCTS.SEARCH(query),
  },
  categories: {
    getAll: () => API_ENDPOINTS.CATEGORIES.BASE,
  },
} as const

