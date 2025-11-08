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

  /**
   * Search products by query string
   * Currently implements client-side filtering. Can be replaced with backend endpoint later.
   * @param query - Search query string
   */
  static async search(query: string): Promise<IProduct[]> {
    try {
      // Fetch all products and filter client-side for now
      // TODO: Replace with backend search endpoint when available
      const allProducts = await this.getAll()
      
      if (!query || !query.trim()) {
        return []
      }

      const searchQuery = query.toLowerCase().trim()
      
      // Filter products by title, description, or category name
      return allProducts.filter((product) => {
        const titleMatch = product.title?.toLowerCase().includes(searchQuery)
        const descriptionMatch = product.description?.toLowerCase().includes(searchQuery)
        const categoryMatch = product.category?.name?.toLowerCase().includes(searchQuery)
        
        return titleMatch || descriptionMatch || categoryMatch
      })
    } catch (error) {
      const apiError = ApiError.fromError(error)
      throw apiError
    }
  }
}

