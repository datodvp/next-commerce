/**
 * Admin Button Component
 * Reusable button component for admin panel
 */

import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './AdminButton.module.scss'

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
  loading?: boolean
}

const AdminButton = ({
  variant = 'primary',
  children,
  loading = false,
  disabled,
  className,
  ...props
}: AdminButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default AdminButton

