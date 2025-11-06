/**
 * Admin Edit Product Page
 * Form to edit an existing product
 */

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { mutate } from 'swr'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput, FormTextarea, FormSelect } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { useCategories } from '@/hooks/api/useCategories'
import { useFlags } from '@/hooks/api/useFlags'
import { adminProductService, UpdateProductData } from '@/admin/services'
import { IProduct } from '@/models/common/types'
import styles from '@/pages/admin/products/product-form.module.scss'
import { API_CONFIG } from '@/api/config'

const EditProduct = () => {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const { flags, isLoading: flagsLoading } = useFlags()
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
    flagIds: [],
  })

  const [existingImages, setExistingImages] = useState<Array<{ id: number; url: string }>>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const productData = await adminProductService.getById(parseInt(id))
        setProduct(productData)
        
        // Extract existing images with their IDs
        const images = productData.images?.map((img) => ({
          id: img.id,
          url: img.url.startsWith('/') ? `${API_CONFIG.baseURL}${img.url}` : img.url,
        })) || []
        
        setExistingImages(images)
        setFormData({
          id: productData.id,
          sku: productData.sku || '',
          title: productData.title,
          slug: productData.slug,
          description: productData.description || '',
          price: productData.price,
          stock: productData.stock || 0,
          categoryId: productData.category?.id || 0,
          flagIds: productData.flags?.map((flag) => flag.id) || [],
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

  const handleInputChange = (field: keyof UpdateProductData, value: string | number | number[]) => {
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

  const handleExistingImageDelete = async (imageId: number) => {
    if (!formData.id) return
    
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    setDeletingImageId(imageId)
    try {
      await adminProductService.deleteImage(formData.id, imageId)
      // Remove from local state
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      // Refresh product data
      const productData = await adminProductService.getById(formData.id)
      setProduct(productData)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setDeletingImageId(null)
    }
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

    setIsSubmitting(true)

    try {
      await adminProductService.update(
        formData,
        imageFiles.length > 0 ? imageFiles : undefined
      )
      // Revalidate products list cache and individual product cache
      await mutate('products/all')
      if (formData.id) {
        await mutate(`products/${formData.id}`)
      }
      router.push('/admin/products')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || categoriesLoading || flagsLoading || isLoading) {
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

          <FormGroup label="Flags (optional)">
            <div className={styles.flagsContainer}>
              {flags && flags.length > 0 ? (
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
                <p className={styles.noFlags}>No flags available. Create flags first.</p>
              )}
            </div>
          </FormGroup>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <FormGroup label="Existing Images">
              <div className={styles.imageGrid}>
                {existingImages.map((image) => (
                  <div key={image.id} className={styles.imagePreview}>
                    <Image 
                      src={image.url} 
                      alt={`Product image ${image.id}`} 
                      width={150} 
                      height={150} 
                      className={styles.image} 
                      unoptimized 
                    />
                    <button
                      type="button"
                      onClick={() => handleExistingImageDelete(image.id)}
                      className={styles.removeImageButton}
                      title="Delete image"
                      disabled={deletingImageId === image.id}
                    >
                      {deletingImageId === image.id ? '...' : '×'}
                    </button>
                  </div>
                ))}
              </div>
            </FormGroup>
          )}

          {/* Upload New Images */}
          <FormGroup label="Upload New Images">
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
              Update Product
            </AdminButton>
          </div>
        </AdminForm>
      </AdminCard>
    </AdminLayout>
  )
}

export default EditProduct

