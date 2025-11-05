import { IProduct } from '@/models/common/types'
import { api, handleApiError } from './api'

export const requestProducts = {
  fetchAllProducts: async (): Promise<IProduct[]> => {
    try {
      const { data } = await api.get<IProduct[]>('/products')
      return data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Error fetching products:', apiError.message)
      throw apiError
    }
  },
  fetchProductBySlug: async (slug: string): Promise<IProduct | null> => {
    try {
      const { data } = await api.get<IProduct>(`/products/slug/${slug}`)
      return data
    } catch (error) {
      const apiError = handleApiError(error)
      if (apiError.statusCode === 404) {
        return null
      }
      console.error('Error fetching product by slug:', apiError.message)
      throw apiError
    }
  },
  fetchProductsByCategory: async (categoryId: number): Promise<IProduct[]> => {
    try {
      const { data } = await api.get<IProduct[]>(
        `/products/category/${categoryId}`,
      )
      return data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Error fetching products by category:', apiError.message)
      throw apiError
    }
  },
}
