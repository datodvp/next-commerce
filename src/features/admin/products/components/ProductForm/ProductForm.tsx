import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
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
import { useProductForm } from '@/admin/hooks/useProductForm'
import { CreateProductData, UpdateProductData } from '@/admin/services'
import styles from './ProductForm.module.scss'

interface ProductFormProps {
  initialData?: CreateProductData | UpdateProductData
  title?: string
  submitLabel?: string
  redirectTo?: string
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  title = 'Create New Product',
  submitLabel = 'Create Product',
  redirectTo,
}) => {
  const router = useRouter()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const { flags, isLoading: flagsLoading } = useFlags()

  const {
    formData,
    isSubmitting,
    error,
    handleInputChange,
    handleFlagToggle,
    handleSubmit,
    imageFiles,
    imagePreviewUrls,
    fileInputRef,
    handleFileChange,
    handleRemovePreviewImage,
  } = useProductForm({
    initialData,
    redirectTo,
  })

  return (
    <AdminCard>
      <h3>{title}</h3>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <AdminForm onSubmit={handleSubmit}>
        <FormGroup
          label="SKU *"
          error={error && !formData.sku ? 'SKU is required' : ''}
        >
          <FormInput
            type="text"
            placeholder="PROD-001"
            value={formData.sku || ''}
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
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Slug (optional)">
          <FormInput
            type="text"
            placeholder="product-slug"
            value={formData.slug || ''}
            onChange={(e) => handleInputChange('slug', e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Description">
          <FormTextarea
            placeholder="Product description"
            value={formData.description || ''}
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
            disabled={categoriesLoading}
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>

        <FormGroup label="Flags (optional)">
          <div className={styles.flagsContainer}>
            {flagsLoading ? (
              <p className={styles.noFlags}>Loading flags...</p>
            ) : flags.length > 0 ? (
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
            {submitLabel}
          </AdminButton>
        </div>
      </AdminForm>
    </AdminCard>
  )
}

export default ProductForm
