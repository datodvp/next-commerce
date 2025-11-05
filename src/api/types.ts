/**
 * API Types
 * Type definitions for API requests and responses
 */

import { IProduct, ICategory } from '@/models/common/types'

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface QueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
}

// Product API Types
export type ProductResponse = IProduct
export type ProductsResponse = IProduct[]

// Category API Types
export type CategoryResponse = ICategory
export type CategoriesResponse = ICategory[]

