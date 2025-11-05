/**
 * Admin Login Page
 * Login page for admin panel
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminForm, { FormGroup, FormInput } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import AdminCard from '@/admin/components/AdminCard'
import styles from './login.module.scss'

const AdminLogin = () => {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // For now, using a simple mock login
      // In production, this should call your authentication API
      if (email === 'admin@example.com' && password === 'admin123') {
        // Mock auth token and user
        const mockToken = 'mock_admin_token_' + Date.now()
        const mockUser = {
          id: 1,
          email: email,
          name: 'Admin User',
          role: 'admin',
        }

        // Store auth
        localStorage.setItem('admin_auth_token', mockToken)
        localStorage.setItem('admin_user', JSON.stringify(mockUser))
        localStorage.setItem('auth_token', mockToken)

        router.push('/admin')
      } else {
        setError('Invalid email or password')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <AdminCard className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to access the admin panel</p>

        <AdminForm onSubmit={handleSubmit}>
          <FormGroup label="Email" error={error}>
            <FormInput
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Password" error={error}>
            <FormInput
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <AdminButton type="submit" variant="primary" loading={isLoading}>
            Sign In
          </AdminButton>
        </AdminForm>

        <div className={styles.demoInfo}>
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </AdminCard>
    </div>
  )
}

export default AdminLogin

