/**
 * Admin Form Component
 * Reusable form component for admin panel
 */

import { FormHTMLAttributes, ReactNode } from 'react'
import styles from './AdminForm.module.scss'

interface AdminFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

const AdminForm = ({ children, className, ...props }: AdminFormProps) => {
  return (
    <form className={`${styles.form} ${className || ''}`} {...props}>
      {children}
    </form>
  )
}

export default AdminForm

