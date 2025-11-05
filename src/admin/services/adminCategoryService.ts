/**
 * Admin Category Service
 * Service for admin category CRUD operations
 */

import { apiClient } from '@/api'
import { ICategory } from '@/models/common/types'
import { ApiError } from '@/api/errors'

export interface CreateCategoryData {
  name: string
  slug?: string
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: number
}

class AdminCategoryService {
  /**
   * Create a new category
   */
  async create(data: CreateCategoryData): Promise<ICategory> {
    try {
      return await apiClient.post<ICategory>('/categories', data)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Update an existing category
   */
  async update(data: UpdateCategoryData): Promise<ICategory> {
    try {
      const { id, ...updateData } = data
      return await apiClient.patch<ICategory>(`/categories/${id}`, updateData)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Delete a category
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/categories/${id}`)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Get category by ID
   */
  async getById(id: number): Promise<ICategory> {
    try {
      return await apiClient.get<ICategory>(`/categories/${id}`)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }
}

export const adminCategoryService = new AdminCategoryService()

