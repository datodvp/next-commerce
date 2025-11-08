import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import { adminFlagService, CreateFlagData, UpdateFlagData } from '@/admin/services'

interface UseFlagFormOptions {
  initialData?: CreateFlagData | UpdateFlagData
  onSuccess?: () => void
  redirectTo?: string
}

interface UseFlagFormReturn {
  formData: CreateFlagData | UpdateFlagData
  isSubmitting: boolean
  error: string
  handleInputChange: (field: keyof (CreateFlagData | UpdateFlagData), value: string | number) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
}

export const useFlagForm = ({
  initialData,
  onSuccess,
  redirectTo,
}: UseFlagFormOptions = {}): UseFlagFormReturn => {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateFlagData | UpdateFlagData>(
    initialData || {
      name: '',
      discountPercentage: 0,
    }
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = useCallback(
    (field: keyof (CreateFlagData | UpdateFlagData), value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setError('')
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      if (!formData.name?.trim()) {
        setError('Flag name is required')
        return
      }

      if (
        formData.discountPercentage !== undefined &&
        (formData.discountPercentage < 0 || formData.discountPercentage > 100)
      ) {
        setError('Discount percentage must be between 0 and 100')
        return
      }

      setIsSubmitting(true)

      try {
        if ('id' in formData && formData.id) {
          // Update existing flag
          await adminFlagService.update(formData as UpdateFlagData)
        } else {
          // Create new flag
          await adminFlagService.create(formData as CreateFlagData)
        }

        // Revalidate flags list cache
        await mutate('flags/all')

        if (onSuccess) {
          onSuccess()
        } else if (redirectTo) {
          router.push(redirectTo)
        } else {
          router.push('/admin/flags')
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to save flag. Please try again.'
        setError(errorMessage)
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSuccess, redirectTo, router]
  )

  const resetForm = useCallback(() => {
    setFormData(initialData || { name: '', discountPercentage: 0 })
    setError('')
  }, [initialData])

  return {
    formData,
    isSubmitting,
    error,
    handleInputChange,
    handleSubmit,
    resetForm,
  }
}
