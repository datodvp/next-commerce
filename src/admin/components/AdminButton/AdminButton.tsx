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
      className={`${styles.button} ${styles[variant]} ${loading ? styles.loading : ''} ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner}></span>}
      <span className={styles.buttonText}>{loading ? 'Processing...' : children}</span>
    </button>
  )
}

export default AdminButton

