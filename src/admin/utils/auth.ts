/**
 * Admin Authentication Utilities
 * Simple auth utilities for admin panel
 */

const AUTH_TOKEN_KEY = 'admin_auth_token'
const ADMIN_USER_KEY = 'admin_user'

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

/**
 * Set authentication token and user
 */
export const setAuth = (token: string, user: AdminUser): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
    // Also set for API client
    localStorage.setItem('auth_token', token)
  }
}

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }
  return null
}

/**
 * Get admin user
 */
export const getAdminUser = (): AdminUser | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(ADMIN_USER_KEY)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null && getAdminUser() !== null
}

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  const user = getAdminUser()
  return user?.role === 'admin' || false
}

/**
 * Clear authentication
 */
export const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
    localStorage.removeItem('auth_token')
  }
}

