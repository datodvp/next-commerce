/**
 * Admin Edit Product Page
 * Form to edit an existing product
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput, FormTextarea, FormSelect } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { useCategories } from '@/hooks/api/useCategories'
import { adminProductService, UpdateProductData } from '@/admin/services'
import { IProduct } from '@/models/common/types'
import { validateAndNormalizeUrl, isValidUrl } from '@/admin/utils/urlValidation'
import styles from '@/pages/admin/products/product-form.module.scss'
import { API_CONFIG } from '@/api/config'

const EditProduct = () => {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const [product, setProduct] = useState<IProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<UpdateProductData>({
    id: 0,
    sku: '',
    title: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    imageUrls: [],
  })

  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const productData = await adminProductService.getById(parseInt(id))
        setProduct(productData)
        
        // Extract existing image URLs
        const existingImageUrls = productData.images?.map((img) => {
          // If it's a relative URL, make it absolute
          if (img.url.startsWith('/')) {
            return `${API_CONFIG.baseURL}${img.url}`
          }
          return img.url
        }) || []
        
        setExistingImages(existingImageUrls)
        setFormData({
          id: productData.id,
          sku: productData.sku || '',
          title: productData.title,
          slug: productData.slug,
          description: productData.description || '',
          price: productData.price,
          stock: productData.stock || 0,
          categoryId: productData.category?.id || 0,
          imageUrls: [],
        })
      } catch (err) {
        setError('Failed to load product. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleInputChange = (field: keyof UpdateProductData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUrlAdd = () => {
    setUrlError('')
    
    if (!urlInput.trim()) {
      setUrlError('Please enter a URL')
      return
    }

    const validatedUrl = validateAndNormalizeUrl(urlInput.trim())
    
    if (!validatedUrl) {
      setUrlError('Please enter a valid URL (must start with http:// or https://)')
      return
    }

    if (!isValidUrl(validatedUrl)) {
      setUrlError('Invalid URL format')
      return
    }

    // Check for duplicates
    if (imageUrls.includes(validatedUrl) || existingImages.includes(validatedUrl)) {
      setUrlError('This URL is already added')
      return
    }

    setImageUrls((prev) => [...prev, validatedUrl])
    setUrlInput('')
    setUrlError('')
  }

  const handleImageUrlRemove = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files))
    }
  }

  const handleUrlInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleImageUrlAdd()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    setIsSubmitting(true)

    try {
      const updateData: UpdateProductData = {
        ...formData,
        imageUrls: [...existingImages, ...imageUrls].length > 0 
          ? [...existingImages, ...imageUrls] 
          : undefined,
      }

      await adminProductService.update(
        updateData,
        imageFiles.length > 0 ? imageFiles : undefined
      )
      router.push('/admin/products')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || categoriesLoading || isLoading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading...</div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated || !product) {
    return null
  }

  return (
    <AdminLayout>
      <AdminCard>
        <h3>Edit Product</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <AdminForm onSubmit={handleSubmit}>
          <FormGroup label="SKU *">
            <FormInput
              type="text"
              placeholder="PROD-001"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Title *">
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
            <FormGroup label="Price *">
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

          <FormGroup label="Category *">
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <FormGroup label="Existing Images">
              <div className={styles.imageGrid}>
                {existingImages.map((url, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <Image src={url} alt={`Product image ${index + 1}`} width={150} height={150} className={styles.image} unoptimized />
                    <button
                      type="button"
                      onClick={() => handleExistingImageRemove(index)}
                      className={styles.removeImageButton}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </FormGroup>
          )}

          {/* Add New Image URLs */}
          <FormGroup label="Add Image URLs" error={urlError}>
            <div className={styles.urlInputContainer}>
              <FormInput
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value)
                  setUrlError('')
                }}
                onKeyDown={handleUrlInputKeyDown}
                className={styles.urlInput}
              />
              <button
                type="button"
                onClick={handleImageUrlAdd}
                className={styles.addUrlButton}
              >
                Add URL
              </button>
            </div>
            {imageUrls.length > 0 && (
              <div className={styles.imageUrls}>
                {imageUrls.map((url, index) => (
                  <div key={index} className={styles.imageUrlItem}>
                    <span className={styles.urlText}>{url}</span>
                    <button
                      type="button"
                      onClick={() => handleImageUrlRemove(index)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormGroup>

          {/* Upload New Images */}
          <FormGroup label="Upload New Images">
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
              Update Product
            </AdminButton>
          </div>
        </AdminForm>
      </AdminCard>
    </AdminLayout>
  )
}

export default EditProduct

