/**
 * Product Service
 * Business logic layer for product-related operations
 */

import { apiClient, endpoints } from '@/api'
import { ApiError, ApiErrorCode } from '@/api/errors'
import type { ProductsResponse, ProductResponse } from '@/api/types'
import { IProduct } from '@/models/common/types'

export class ProductService {
  /**
   * Fetch all products
   */
  static async getAll(): Promise<IProduct[]> {
    try {
      const data = await apiClient.get<ProductsResponse>(endpoints.products.getAll())
      return data
    } catch (error) {
      const apiError = ApiError.fromError(error)
      throw apiError
    }
  }

  /**
   * Fetch a single product by slug
   * @returns Product or null if not found
   */
  static async getBySlug(slug: string): Promise<IProduct | null> {
    try {
      const data = await apiClient.get<ProductResponse>(
        endpoints.products.getBySlug(slug),
      )
      return data
    } catch (error) {
      const apiError = ApiError.fromError(error)

      // Return null for 404 errors (product not found)
      if (apiError.code === ApiErrorCode.NOT_FOUND) {
        return null
      }

      throw apiError
    }
  }

  /**
   * Fetch products by category ID
   */
  static async getByCategory(categoryId: number): Promise<IProduct[]> {
    try {
      const data = await apiClient.get<ProductsResponse>(
        endpoints.products.getByCategory(categoryId),
      )
      return data
    } catch (error) {
      const apiError = ApiError.fromError(error)
      throw apiError
    }
  }
}

