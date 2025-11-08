import { useState, useCallback } from 'react'

export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<{
    title: string
    message: string
    confirmText: string
    cancelText: string
    onConfirm: () => void
  } | null>(null)

  const openModal = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
    ) => {
      setConfig({
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
      })
      setIsOpen(true)
    },
    [],
  )

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleConfirm = useCallback(() => {
    if (config?.onConfirm) {
      config.onConfirm()
    }
    setIsOpen(false)
  }, [config])

  return {
    isOpen,
    config,
    openModal,
    closeModal,
    handleConfirm,
  }
}

