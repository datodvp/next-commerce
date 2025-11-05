import { ICategory } from '@/models/common/types'
import { api, handleApiError } from './api'

export const requestCategories = {
  fetchAllCategories: async (): Promise<ICategory[]> => {
    try {
      const { data } = await api.get<ICategory[]>('/categories')
      return data
    } catch (error) {
      const apiError = handleApiError(error)
      console.error('Error fetching categories:', apiError.message)
      throw apiError
    }
  },
}
