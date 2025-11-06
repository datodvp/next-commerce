/**
 * Admin Flag Service
 * Service for admin flag CRUD operations
 */

import { apiClient } from '@/api'
import { IFlag } from '@/models/common/types'
import { ApiError } from '@/api/errors'

export interface CreateFlagData {
  name: string
  discountPercentage: number
}

export interface UpdateFlagData extends Partial<CreateFlagData> {
  id: number
}

class AdminFlagService {
  /**
   * Create a new flag
   */
  async create(data: CreateFlagData): Promise<IFlag> {
    try {
      return await apiClient.post<IFlag>('/flags', data)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Update an existing flag
   */
  async update(data: UpdateFlagData): Promise<IFlag> {
    try {
      const { id, ...updateData } = data
      return await apiClient.patch<IFlag>(`/flags/${id}`, updateData)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Delete a flag
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/flags/${id}`)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Get flag by ID
   */
  async getById(id: number): Promise<IFlag> {
    try {
      return await apiClient.get<IFlag>(`/flags/${id}`)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Get all flags
   */
  async getAll(): Promise<IFlag[]> {
    try {
      return await apiClient.get<IFlag[]>('/flags')
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }
}

export const adminFlagService = new AdminFlagService()

