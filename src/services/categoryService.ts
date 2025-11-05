/**
 * Category Service
 * Business logic layer for category-related operations
 */

import { apiClient, endpoints } from '@/api'
import { ApiError } from '@/api/errors'
import type { CategoriesResponse } from '@/api/types'
import { ICategory } from '@/models/common/types'

export class CategoryService {
  /**
   * Fetch all categories
   */
  static async getAll(): Promise<ICategory[]> {
    try {
      const data = await apiClient.get<CategoriesResponse>(
        endpoints.categories.getAll(),
      )
      return data
    } catch (error) {
      const apiError = ApiError.fromError(error)
      throw apiError
    }
  }
}

