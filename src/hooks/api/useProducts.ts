/**
 * Products API Hooks
 * SWR hooks for product data fetching with caching and revalidation
 */

import useSWR from 'swr'
import { ProductService } from '@/services'
import { IProduct } from '@/models/common/types'
import { ApiError } from '@/api/errors'

// SWR fetcher function
const fetcher = async <T>(key: string, fetcherFn: () => Promise<T>): Promise<T> => {
  return fetcherFn()
}

/**
 * Hook to fetch all products
 */
export const useProducts = () => {
  const { data, error, isLoading, mutate } = useSWR<IProduct[], ApiError>(
    'products/all',
    () => fetcher('products/all', () => ProductService.getAll()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    },
  )

  return {
    products: data || [],
    isLoading,
    isError: error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch a single product by slug
 */
export const useProduct = (slug: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<IProduct | null, ApiError>(
    slug ? `products/${slug}` : null,
    () =>
      fetcher(
        `products/${slug}`,
        () => (slug ? ProductService.getBySlug(slug) : Promise.resolve(null)),
      ),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    },
  )

  return {
    product: data ?? null,
    isLoading,
    isError: error,
    error,
    mutate,
  }
}

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (categoryId: number | null) => {
  const { data, error, isLoading, mutate } = useSWR<IProduct[], ApiError>(
    categoryId ? `products/category/${categoryId}` : null,
    () =>
      fetcher(
        `products/category/${categoryId}`,
        () =>
          categoryId
            ? ProductService.getByCategory(categoryId)
            : Promise.resolve([]),
      ),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    },
  )

  return {
    products: data || [],
    isLoading,
    isError: error,
    error,
    mutate,
  }
}

