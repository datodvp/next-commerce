import React from 'react'
import styles from './PageHeader.module.scss'

interface PageHeaderProps {
  title: string
  action?: {
    label: string
    onClick: () => void
    ariaLabel?: string
  }
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, action }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {action && (
        <button
          onClick={action.onClick}
          className={styles.clearButton}
          aria-label={action.ariaLabel || action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default PageHeader
