import { IProduct } from '@/models/common/types'
import { api } from './api'

export const requestProducts = {
  fetchAllProducts: async () => {
    try {
      const { data } = await api.get<IProduct[]>('/products')
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },
  fetchProductBySlug: async (slug: string) => {
    try {
      const { data } = await api.get<IProduct>(`/products/slug/${slug}`)
      return data
    } catch (error) {
      console.error('Error fetching products by slug:', error)
      return []
    }
  },
  fetchProductsByCategory: async (categoryId: number) => {
    try {
      const { data } = await api.get<IProduct[]>(
        `/categories/${categoryId}/products`,
      )
      return data
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  },
}
