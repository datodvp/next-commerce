import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    return new ApiError(
      axiosError.message || 'An API error occurred',
      axiosError.response?.status,
      error,
    )
  }
  if (error instanceof Error) {
    return new ApiError(error.message, undefined, error)
  }
  return new ApiError('An unknown error occurred', undefined, error)
}
