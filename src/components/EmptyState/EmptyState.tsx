import Link from 'next/link'
import styles from './EmptyState.module.scss'

interface EmptyStateProps {
  icon?: string
  title: string
  message: string
  actionLabel?: string
  actionHref?: string
  onActionClick?: () => void
}

const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  actionHref,
  onActionClick,
}: EmptyStateProps) => {
  const renderAction = () => {
    if (!actionLabel) return null

    if (actionHref) {
      return (
        <Link href={actionHref} className={styles.link}>
          {actionLabel}
        </Link>
      )
    }

    if (onActionClick) {
      return (
        <button onClick={onActionClick} className={styles.button}>
          {actionLabel}
        </button>
      )
    }

    return null
  }

  return (
    <div className={styles.root}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      {renderAction()}
    </div>
  )
}

export default EmptyState

