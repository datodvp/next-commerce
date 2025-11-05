/**
 * Admin Authentication Hook
 * React hook for admin authentication state
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { isAuthenticated, isAdmin, getAdminUser, clearAuth, AdminUser } from '../utils/auth'

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check auth status on mount
    if (isAuthenticated() && isAdmin()) {
      setUser(getAdminUser())
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push('/admin/login')
  }

  const requireAuth = () => {
    if (!loading && !isAuthenticated()) {
      router.push('/admin/login')
      return false
    }
    if (!loading && !isAdmin()) {
      router.push('/admin/login')
      return false
    }
    return true
  }

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated() && isAdmin(),
    logout,
    requireAuth,
  }
}

