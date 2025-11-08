/**
 * Admin Edit Product Page
 * Form to edit an existing product
 */

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { mutate } from 'swr'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
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
import { adminProductService, UpdateProductData } from '@/admin/services'
import { IProduct } from '@/models/common/types'
import styles from '@/pages/admin/products/product-form.module.scss'
import { normalizeImageUrl } from '@/utils/imageUtils'

const EditProduct = () => {
  const router = useRouter()
  const { id } = router.query
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

  const [existingImages, setExistingImages] = useState<
    Array<{ id: number; url: string; order?: number }>
  >([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null)
  const [dragOverImageId, setDragOverImageId] = useState<number | null>(null)
  const [originalImageOrder, setOriginalImageOrder] = useState<
    Array<{ id: number; order: number }>
  >([])
  const fileInputRef = useRef<HTMLInputElement>(null)


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

        // Extract existing images with their IDs and order
        const images =
          productData.images?.map((img) => ({
            id: img.id,
            url: normalizeImageUrl(img.url),
            order: img.order ?? 0,
          })) || []

        // Sort images by order
        const sortedImages = [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setExistingImages(sortedImages)
        // Store original order for comparison
        setOriginalImageOrder(
          sortedImages.map((img) => ({ id: img.id, order: img.order ?? 0 })),
        )
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

  const handleInputChange = (
    field: keyof UpdateProductData,
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
      // Update original order to reflect deletion
      setOriginalImageOrder((prev) => prev.filter((img) => img.id !== imageId))
      // Refresh product data
      const productData = await adminProductService.getById(formData.id)
      setProduct(productData)
      // Update original order after refresh
      const images =
        productData.images?.map((img) => ({
          id: img.id,
          url: normalizeImageUrl(img.url),
          order: img.order ?? 0,
        })) || []
      const sortedImages = [...images].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      )
      setOriginalImageOrder(
        sortedImages.map((img) => ({ id: img.id, order: img.order ?? 0 })),
      )
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to delete image. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, imageId: number) => {
    setDraggedImageId(imageId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', imageId.toString())
  }

  const handleDragOver = (e: React.DragEvent, imageId: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedImageId !== imageId) {
      setDragOverImageId(imageId)
    }
  }

  const handleDragLeave = () => {
    setDragOverImageId(null)
  }

  const handleDrop = (e: React.DragEvent, targetImageId: number) => {
    e.preventDefault()
    setDragOverImageId(null)

    if (!draggedImageId || draggedImageId === targetImageId) {
      setDraggedImageId(null)
      return
    }

    const draggedIndex = existingImages.findIndex(
      (img) => img.id === draggedImageId,
    )
    const targetIndex = existingImages.findIndex(
      (img) => img.id === targetImageId,
    )

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedImageId(null)
      return
    }

    // Create new array with reordered images
    const newImages = [...existingImages]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)

    // Update order values (only in local state, not saved yet)
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
    }))

    // Update local state only - no API call
    setExistingImages(reorderedImages)
    setDraggedImageId(null)
  }

  const handleDragEnd = () => {
    setDraggedImageId(null)
    setDragOverImageId(null)
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
      // Check if image order has changed
      const currentImageOrder = existingImages.map((img, index) => ({
        id: img.id,
        order: index,
      }))

      const orderChanged =
        currentImageOrder.length !== originalImageOrder.length ||
        currentImageOrder.some(
          (img, index) =>
            originalImageOrder.find((orig) => orig.id === img.id)?.order !==
            index,
        )

      // If order changed, update image order first
      if (orderChanged && formData.id && existingImages.length > 0) {
        const imageOrders = currentImageOrder.map((img) => ({
          imageId: img.id,
          order: img.order,
        }))

        await adminProductService.reorderImages(formData.id, imageOrders)
      }

      // Then update the product
      await adminProductService.update(
        formData,
        imageFiles.length > 0 ? imageFiles : undefined,
      )

      // Revalidate products list cache, individual product cache, categories cache, and flags cache (for product counts)
      await mutate('products/all')
      if (formData.id) {
        await mutate(`products/${formData.id}`)
      }
      await mutate('categories/all')
      await mutate('flags/all')
      router.push('/admin/products')
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update product. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) {
    return (
      <AdminPageWrapper loading={isLoading}>
        <AdminLayout />
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper loading={categoriesLoading || flagsLoading || isLoading}>
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

          <FormGroup label="Category *">
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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <FormGroup label="Existing Images (drag to reorder - changes saved on Update)">
              <div className={styles.imageGrid}>
                {existingImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`${styles.imagePreview} ${
                      draggedImageId === image.id ? styles.dragging : ''
                    } ${
                      dragOverImageId === image.id ? styles.dragOver : ''
                    } ${index === 0 ? styles.mainImage : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, image.id)}
                    onDragOver={(e) => handleDragOver(e, image.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, image.id)}
                    onDragEnd={handleDragEnd}
                  >
                    {index === 0 && (
                      <div className={styles.mainImageBadge}>Main Image</div>
                    )}
                    <div className={styles.dragHandle} title="Drag to reorder">
                      ⋮⋮
                    </div>
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExistingImageDelete(image.id)
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
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
    </AdminPageWrapper>
  )
}

export default EditProduct
