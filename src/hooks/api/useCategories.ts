/**
 * Categories API Hooks
 * SWR hooks for category data fetching with caching and revalidation
 */

import useSWR from 'swr'
import { CategoryService } from '@/services'
import { ICategory } from '@/models/common/types'
import { ApiError } from '@/api/errors'

// SWR fetcher function
const fetcher = async <T>(key: string, fetcherFn: () => Promise<T>): Promise<T> => {
  return fetcherFn()
}

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR<ICategory[], ApiError>(
    'categories/all',
    () => fetcher('categories/all', () => CategoryService.getAll()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes (categories change less frequently)
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    },
  )

  return {
    categories: data || [],
    isLoading,
    isError: error,
    error,
    mutate,
  }
}

