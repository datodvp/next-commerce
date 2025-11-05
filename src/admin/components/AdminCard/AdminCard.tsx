/**
 * Admin Card Component
 * Reusable card component for admin panel
 */

import { ReactNode } from 'react'
import styles from './AdminCard.module.scss'

interface AdminCardProps {
  children: ReactNode
  title?: string
  className?: string
}

const AdminCard = ({ children, title, className }: AdminCardProps) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default AdminCard

