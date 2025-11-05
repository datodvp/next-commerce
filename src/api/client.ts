/**
 * API Client
 * Axios instance with interceptors, retry logic, and error handling
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from './config'
import { ApiError } from './errors'

class ApiClient {
  private client: AxiosInstance
  private retryCount = 0

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = this.getAuthToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Reset retry count on success
        this.retryCount = 0

        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status)
        }

        return response
      },
      async (error: AxiosError<import('./errors').ApiErrorResponse>) => {
        const apiError = ApiError.fromAxiosError(error)

        // Retry logic for network errors and 5xx errors
        if (this.shouldRetry(apiError) && this.retryCount < API_CONFIG.retries) {
          this.retryCount++
          await this.delay(API_CONFIG.retryDelay * this.retryCount)

          if (process.env.NODE_ENV === 'development') {
            console.log(`[API Retry] Attempt ${this.retryCount}/${API_CONFIG.retries}`)
          }

          return this.client.request(error.config as AxiosRequestConfig)
        }

        // Reset retry count
        this.retryCount = 0

        return Promise.reject(apiError)
      },
    )
  }

  private shouldRetry(error: ApiError): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.isNetworkError() ||
      (error.isServerError() && error.statusCode !== 501 && error.statusCode !== 505)
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private getAuthToken(): string | null {
    // TODO: Implement token retrieval from storage/cookies
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || null
    }
    return null
  }

  // Public methods
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T>(url, config).then((response) => response.data)
  }

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config).then((response) => response.data)
  }

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config).then((response) => response.data)
  }

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch<T>(url, data, config).then((response) => response.data)
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config).then((response) => response.data)
  }

  // Get the underlying axios instance if needed
  getInstance(): AxiosInstance {
    return this.client
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

