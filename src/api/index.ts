/**
 * API Module
 * Central export point for all API-related functionality
 */

export { apiClient } from './client'
export { API_CONFIG, API_ENDPOINTS } from './config'
export { endpoints } from './endpoints'
export { ApiError, ApiErrorCode, type ApiErrorResponse } from './errors'
export type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  ProductResponse,
  ProductsResponse,
  CategoryResponse,
  CategoriesResponse,
} from './types'

