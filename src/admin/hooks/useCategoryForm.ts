import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import { adminCategoryService, CreateCategoryData, UpdateCategoryData } from '@/admin/services'

interface UseCategoryFormOptions {
  initialData?: CreateCategoryData | UpdateCategoryData
  onSuccess?: () => void
  redirectTo?: string
}

interface UseCategoryFormReturn {
  formData: CreateCategoryData | UpdateCategoryData
  isSubmitting: boolean
  error: string
  handleInputChange: (field: keyof (CreateCategoryData | UpdateCategoryData), value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
}

export const useCategoryForm = ({
  initialData,
  onSuccess,
  redirectTo,
}: UseCategoryFormOptions = {}): UseCategoryFormReturn => {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateCategoryData | UpdateCategoryData>(
    initialData || {
      name: '',
      slug: '',
    }
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = useCallback(
    (field: keyof (CreateCategoryData | UpdateCategoryData), value: string) => {
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
        setError('Category name is required')
        return
      }

      setIsSubmitting(true)

      try {
        if ('id' in formData && formData.id) {
          // Update existing category
          await adminCategoryService.update(formData as UpdateCategoryData)
        } else {
          // Create new category
          await adminCategoryService.create(formData as CreateCategoryData)
        }

        // Revalidate categories list cache
        await mutate('categories/all')

        if (onSuccess) {
          onSuccess()
        } else if (redirectTo) {
          router.push(redirectTo)
        } else {
          router.push('/admin/categories')
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to save category. Please try again.'
        setError(errorMessage)
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSuccess, redirectTo, router]
  )

  const resetForm = useCallback(() => {
    setFormData(initialData || { name: '', slug: '' })
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
