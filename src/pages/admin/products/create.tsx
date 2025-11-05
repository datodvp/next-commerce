/**
 * Admin Create Product Page
 * Form to create a new product
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput, FormTextarea, FormSelect } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { useCategories } from '@/hooks/api/useCategories'
import { adminProductService, CreateProductData } from '@/admin/services'
import styles from '@/pages/admin/products/product-form.module.scss'

const CreateProduct = () => {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const { categories, isLoading: categoriesLoading } = useCategories()
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
    imageUrls: [],
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  const handleInputChange = (field: keyof CreateProductData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:')
    if (url && url.trim()) {
      // Basic URL validation
      try {
        const urlObj = new URL(url.trim())
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
          setImageUrls((prev) => [...prev, url.trim()])
        } else {
          alert('Please enter a valid URL (must start with http:// or https://)')
        }
      } catch {
        alert('Please enter a valid URL')
      }
    }
  }

  const handleImageUrlRemove = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files))
    }
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
      const productData: CreateProductData = {
        ...formData,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      }

      await adminProductService.create(productData, imageFiles.length > 0 ? imageFiles : undefined)
      router.push('/admin/products')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || categoriesLoading) {
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
          <FormGroup label="SKU *" error={error && !formData.sku ? 'SKU is required' : ''}>
            <FormInput
              type="text"
              placeholder="PROD-001"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Title *" error={error && !formData.title ? 'Title is required' : ''}>
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
            <FormGroup label="Price *" error={error && !formData.price ? 'Price is required' : ''}>
              <FormInput
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                required
              />
            </FormGroup>

            <FormGroup label="Stock">
              <FormInput
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock || ''}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              />
            </FormGroup>
          </div>

          <FormGroup label="Category *" error={error && !formData.categoryId ? 'Category is required' : ''}>
            <FormSelect
              value={formData.categoryId || ''}
              onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
              required
            >
              <option value="">Select a category</option>
              {categories?.map((category: import('@/models/common/types').ICategory) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup label="Image URLs">
            <div className={styles.imageUrls}>
              {imageUrls.map((url, index) => (
                <div key={index} className={styles.imageUrlItem}>
                  <span>{url}</span>
                  <button
                    type="button"
                    onClick={() => handleImageUrlRemove(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleImageUrlAdd} className={styles.addButton}>
                Add Image URL
              </button>
            </div>
          </FormGroup>

          <FormGroup label="Upload Images">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            {imageFiles.length > 0 && (
              <div className={styles.fileList}>
                {imageFiles.map((file, index) => (
                  <span key={index} className={styles.fileName}>
                    {file.name}
                  </span>
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

