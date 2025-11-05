import React, { useEffect } from 'react'
import styles from './ConfirmationModal.module.scss'

interface IProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: IProps): React.ReactElement | null => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
        </div>
        <div className={styles.body}>
          <p id="modal-description" className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

