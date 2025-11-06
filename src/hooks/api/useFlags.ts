/**
 * useFlags Hook
 * Hook for fetching flags
 */

import useSWR from 'swr'
import { apiClient } from '@/api'
import { IFlag } from '@/models/common/types'

const fetcher = async (url: string): Promise<IFlag[]> => {
  return await apiClient.get<IFlag[]>(url)
}

export const useFlags = () => {
  const { data, error, isLoading, mutate } = useSWR<IFlag[]>('/flags', fetcher)

  return {
    flags: data,
    isLoading,
    isError: error,
    mutate,
  }
}

