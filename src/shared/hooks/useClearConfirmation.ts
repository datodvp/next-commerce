import { useCallback } from 'react'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'

interface UseClearConfirmationOptions {
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export const useClearConfirmation = ({
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: UseClearConfirmationOptions) => {
  const { isOpen, openModal, closeModal, handleConfirm, config } =
    useConfirmationModal()

  const handleClear = useCallback(() => {
    openModal(title, message, onConfirm, confirmText, cancelText)
  }, [openModal, title, message, onConfirm, confirmText, cancelText])

  return {
    isOpen,
    handleClear,
    closeModal,
    handleConfirm,
    title: config?.title || title,
    message: config?.message || message,
    confirmText: config?.confirmText || confirmText,
    cancelText: config?.cancelText || cancelText,
  }
}
