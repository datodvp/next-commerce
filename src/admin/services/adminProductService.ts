/**
 * Admin Product Service
 * Service for admin product CRUD operations
 */

import { apiClient } from '@/api'
import { IProduct } from '@/models/common/types'
import { ApiError } from '@/api/errors'

export interface CreateProductData {
  sku: string
  title: string
  slug?: string
  description?: string
  price: number
  stock?: number
  categoryId: number
  imageUrls?: string[]
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number
}

class AdminProductService {
  /**
   * Create a new product
   */
  async create(data: CreateProductData, images?: File[]): Promise<IProduct> {
    try {
      const formData = new FormData()
      
      // Append product data
      formData.append('sku', data.sku)
      formData.append('title', data.title)
      formData.append('price', data.price.toString())
      formData.append('categoryId', data.categoryId.toString())
      
      if (data.slug) formData.append('slug', data.slug)
      if (data.description) formData.append('description', data.description)
      if (data.stock !== undefined) formData.append('stock', data.stock.toString())
      if (data.imageUrls && data.imageUrls.length > 0) {
        formData.append('imageUrls', JSON.stringify(data.imageUrls))
      }
      
      // Append image files
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image)
        })
      }
      
      const response = await apiClient.getInstance().post<IProduct>(
        '/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      
      return response.data
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Update an existing product
   */
  async update(data: UpdateProductData, images?: File[]): Promise<IProduct> {
    try {
      const { id, imageUrls, ...updateData } = data

      // If we have images or imageUrls, use FormData
      if ((images && images.length > 0) || (imageUrls && imageUrls.length > 0)) {
        const formData = new FormData()

        // Append product data
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'string' || typeof value === 'number') {
              formData.append(key, value.toString())
            }
          }
        })

        // Append image URLs if provided
        if (imageUrls && imageUrls.length > 0) {
          formData.append('imageUrls', JSON.stringify(imageUrls))
        }

        // Append image files
        if (images && images.length > 0) {
          images.forEach((image) => {
            formData.append('images', image)
          })
        }

        const response = await apiClient.getInstance().patch<IProduct>(
          `/products/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        return response.data
      }

      // Otherwise, use regular JSON update
      return await apiClient.patch<IProduct>(`/products/${id}`, updateData)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Delete a product
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }

  /**
   * Get product by ID
   */
  async getById(id: number): Promise<IProduct> {
    try {
      return await apiClient.get<IProduct>(`/products/${id}`)
    } catch (error) {
      throw ApiError.fromAxiosError(error as import('axios').AxiosError<import('@/api/errors').ApiErrorResponse>)
    }
  }
}

export const adminProductService = new AdminProductService()

