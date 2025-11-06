/**
 * useFlags Hook
 * Hook for fetching flags
 */

import useSWR from 'swr'
import { apiClient } from '@/api'
import { IFlag } from '@/models/common/types'
import { ApiError } from '@/api/errors'

// SWR fetcher function
const fetcher = async <T>(key: string, fetcherFn: () => Promise<T>): Promise<T> => {
  return fetcherFn()
}

/**
 * Hook to fetch all flags
 */
export const useFlags = () => {
  const { data, error, isLoading, mutate } = useSWR<IFlag[], ApiError>(
    'flags/all',
    () => fetcher('flags/all', () => apiClient.get<IFlag[]>('/flags')),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes (flags change less frequently)
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    },
  )

  return {
    flags: data || [],
    isLoading,
    isError: error,
    error,
    mutate,
  }
}

