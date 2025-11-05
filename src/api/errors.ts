/**
 * API Error Handling
 * Custom error classes and error handling utilities
 */

import { AxiosError } from 'axios'

export enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: ApiErrorCode,
    public response?: ApiErrorResponse,
    public originalError?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static fromAxiosError(error: AxiosError<ApiErrorResponse>): ApiError {
    const statusCode = error.response?.status
    const response = error.response?.data

    let code: ApiErrorCode
    let message: string

    if (!error.response) {
      // Network error or timeout
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        code = ApiErrorCode.TIMEOUT
        message = 'Request timeout. Please try again.'
      } else {
        code = ApiErrorCode.NETWORK_ERROR
        message = 'Network error. Please check your connection.'
      }
    } else {
      switch (statusCode) {
        case 400:
          code = ApiErrorCode.VALIDATION_ERROR
          message = response?.message || 'Invalid request'
          break
        case 401:
          code = ApiErrorCode.UNAUTHORIZED
          message = response?.message || 'Unauthorized'
          break
        case 403:
          code = ApiErrorCode.FORBIDDEN
          message = response?.message || 'Forbidden'
          break
        case 404:
          code = ApiErrorCode.NOT_FOUND
          message = response?.message || 'Resource not found'
          break
        case 500:
        case 502:
        case 503:
          code = ApiErrorCode.SERVER_ERROR
          message = response?.message || 'Server error. Please try again later.'
          break
        default:
          code = ApiErrorCode.UNKNOWN_ERROR
          message = response?.message || 'An unexpected error occurred'
      }
    }

    return new ApiError(
      message,
      statusCode,
      code,
      response,
      error,
    )
  }

  static fromError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    if (error instanceof Error) {
      return new ApiError(
        error.message,
        undefined,
        ApiErrorCode.UNKNOWN_ERROR,
        undefined,
        error,
      )
    }

    return new ApiError(
      'An unknown error occurred',
      undefined,
      ApiErrorCode.UNKNOWN_ERROR,
      undefined,
      error,
    )
  }

  isNetworkError(): boolean {
    return this.code === ApiErrorCode.NETWORK_ERROR || this.code === ApiErrorCode.TIMEOUT
  }

  isClientError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 400 && this.statusCode < 500
  }

  isServerError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 500
  }
}

