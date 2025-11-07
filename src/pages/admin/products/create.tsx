/**
 * Admin Create Product Page
 * Form to create a new product
 */

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { mutate } from 'swr'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, {
  FormGroup,
  FormInput,
  FormTextarea,
  FormSelect,
} from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { useCategories } from '@/hooks/api/useCategories'
import { useFlags } from '@/hooks/api/useFlags'
import { adminProductService, CreateProductData } from '@/admin/services'
import styles from '@/pages/admin/products/product-form.module.scss'

const CreateProduct = () => {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const { flags, isLoading: flagsLoading } = useFlags()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<CreateProductData>({
    sku: '',
    title: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    flagIds: [],
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviewUrls])

  const handleInputChange = (
    field: keyof CreateProductData,
    value: string | number | number[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFlagToggle = (flagId: number) => {
    setFormData((prev) => {
      const currentFlagIds = prev.flagIds || []
      const newFlagIds = currentFlagIds.includes(flagId)
        ? currentFlagIds.filter((id) => id !== flagId)
        : [...currentFlagIds, flagId]
      return { ...prev, flagIds: newFlagIds }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])

      // Create preview URLs for new files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }

    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemovePreviewImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])

    // Remove from both arrays
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.categoryId) {
      setError('Please select a category')
      return
    }

    setIsSubmitting(true)

    try {
      await adminProductService.create(
        formData,
        imageFiles.length > 0 ? imageFiles : undefined,
      )
      // Revalidate products list cache, categories cache, and flags cache (for product counts)
      await mutate('products/all')
      await mutate('categories/all')
      await mutate('flags/all')
      router.push('/admin/products')
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to create product. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || categoriesLoading || flagsLoading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading...</div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <AdminCard>
        <h3>Create New Product</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <AdminForm onSubmit={handleSubmit}>
          <FormGroup
            label="SKU *"
            error={error && !formData.sku ? 'SKU is required' : ''}
          >
            <FormInput
              type="text"
              placeholder="PROD-001"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup
            label="Title *"
            error={error && !formData.title ? 'Title is required' : ''}
          >
            <FormInput
              type="text"
              placeholder="Product Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Slug (optional)">
            <FormInput
              type="text"
              placeholder="product-slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Description">
            <FormTextarea
              placeholder="Product description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </FormGroup>

          <div className={styles.row}>
            <FormGroup
              label="Price *"
              error={error && !formData.price ? 'Price is required' : ''}
            >
              <FormInput
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) =>
                  handleInputChange('price', parseFloat(e.target.value) || 0)
                }
                required
              />
            </FormGroup>

            <FormGroup label="Stock">
              <FormInput
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock || ''}
                onChange={(e) =>
                  handleInputChange('stock', parseInt(e.target.value) || 0)
                }
              />
            </FormGroup>
          </div>

          <FormGroup
            label="Category *"
            error={error && !formData.categoryId ? 'Category is required' : ''}
          >
            <FormSelect
              value={formData.categoryId || ''}
              onChange={(e) =>
                handleInputChange('categoryId', parseInt(e.target.value))
              }
              required
            >
              <option value="">Select a category</option>
              {categories?.map(
                (category: import('@/models/common/types').ICategory) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ),
              )}
            </FormSelect>
          </FormGroup>

          <FormGroup label="Flags (optional)">
            <div className={styles.flagsContainer}>
              {flags.length > 0 ? (
                flags.map((flag) => (
                  <label key={flag.id} className={styles.flagCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.flagIds?.includes(flag.id) || false}
                      onChange={() => handleFlagToggle(flag.id)}
                    />
                    <span>
                      {flag.name} ({flag.discountPercentage}% off)
                    </span>
                  </label>
                ))
              ) : (
                <p className={styles.noFlags}>
                  No flags available. Create flags first.
                </p>
              )}
            </div>
          </FormGroup>

          <FormGroup label="Upload Images *">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            {imageFiles.length > 0 && (
              <div className={styles.imageGrid}>
                {imageFiles.map((file, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <Image
                      src={imagePreviewUrls[index]}
                      alt={`Preview ${file.name}`}
                      width={150}
                      height={150}
                      className={styles.image}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreviewImage(index)}
                      className={styles.removeImageButton}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormGroup>

          <div className={styles.actions}>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={isSubmitting}>
              Create Product
            </AdminButton>
          </div>
        </AdminForm>
      </AdminCard>
    </AdminLayout>
  )
}

export default CreateProduct
