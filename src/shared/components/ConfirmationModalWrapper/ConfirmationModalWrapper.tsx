import React from 'react'
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal'

interface ConfirmationModalWrapperProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const ConfirmationModalWrapper: React.FC<ConfirmationModalWrapperProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  )
}

export default ConfirmationModalWrapper
