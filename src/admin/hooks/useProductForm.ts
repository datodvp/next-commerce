import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import { adminProductService, CreateProductData, UpdateProductData } from '@/admin/services'
import { useImageUpload } from './useImageUpload'

interface UseProductFormOptions {
  initialData?: CreateProductData | UpdateProductData
  onSuccess?: () => void
  redirectTo?: string
}

interface UseProductFormReturn {
  formData: CreateProductData | UpdateProductData
  isSubmitting: boolean
  error: string
  handleInputChange: (
    field: keyof (CreateProductData | UpdateProductData),
    value: string | number | number[]
  ) => void
  handleFlagToggle: (flagId: number) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
  imageFiles: File[]
  imagePreviewUrls: string[]
  fileInputRef: React.RefObject<HTMLInputElement>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemovePreviewImage: (index: number) => void
  clearImages: () => void
}

export const useProductForm = ({
  initialData,
  onSuccess,
  redirectTo,
}: UseProductFormOptions = {}): UseProductFormReturn => {
  const router = useRouter()
  const {
    imageFiles,
    imagePreviewUrls,
    fileInputRef,
    handleFileChange,
    handleRemovePreviewImage,
    clearImages,
  } = useImageUpload()

  const [formData, setFormData] = useState<CreateProductData | UpdateProductData>(
    initialData || {
      sku: '',
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      flagIds: [],
    }
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = useCallback(
    (field: keyof (CreateProductData | UpdateProductData), value: string | number | number[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setError('')
    },
    []
  )

  const handleFlagToggle = useCallback((flagId: number) => {
    setFormData((prev) => {
      const currentFlagIds = prev.flagIds || []
      const newFlagIds = currentFlagIds.includes(flagId)
        ? currentFlagIds.filter((id) => id !== flagId)
        : [...currentFlagIds, flagId]
      return { ...prev, flagIds: newFlagIds }
    })
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      if (!formData.categoryId) {
        setError('Please select a category')
        return
      }

      if (!formData.sku?.trim()) {
        setError('SKU is required')
        return
      }

      if (!formData.title?.trim()) {
        setError('Title is required')
        return
      }

      setIsSubmitting(true)

      try {
        const imagesToUpload = imageFiles.length > 0 ? imageFiles : undefined

        if ('id' in formData && formData.id) {
          // Update existing product
          await adminProductService.update(formData as UpdateProductData, imagesToUpload)
        } else {
          // Create new product
          await adminProductService.create(formData as CreateProductData, imagesToUpload)
        }

        // Revalidate caches
        await mutate('products/all')
        await mutate('categories/all')
        await mutate('flags/all')

        if (onSuccess) {
          onSuccess()
        } else if (redirectTo) {
          router.push(redirectTo)
        } else {
          router.push('/admin/products')
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save product. Please try again.'
        setError(errorMessage)
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, imageFiles, onSuccess, redirectTo, router]
  )

  const resetForm = useCallback(() => {
    setFormData(
      initialData || {
        sku: '',
        title: '',
        slug: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: 0,
        flagIds: [],
      }
    )
    setError('')
    clearImages()
  }, [initialData, clearImages])

  return {
    formData,
    isSubmitting,
    error,
    handleInputChange,
    handleFlagToggle,
    handleSubmit,
    resetForm,
    imageFiles,
    imagePreviewUrls,
    fileInputRef,
    handleFileChange,
    handleRemovePreviewImage,
    clearImages,
  }
}
