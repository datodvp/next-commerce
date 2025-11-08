import React from 'react'
import { useRouter } from 'next/router'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { useCategoryForm } from '@/admin/hooks/useCategoryForm'
import { CreateCategoryData, UpdateCategoryData } from '@/admin/services'
import styles from './CategoryForm.module.scss'

interface CategoryFormProps {
  initialData?: CreateCategoryData | UpdateCategoryData
  title?: string
  submitLabel?: string
  redirectTo?: string
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  title = 'Create New Category',
  submitLabel = 'Create Category',
  redirectTo,
}) => {
  const router = useRouter()
  const { formData, isSubmitting, error, handleInputChange, handleSubmit } = useCategoryForm({
    initialData,
    redirectTo,
  })

  return (
    <AdminCard>
      <h3>{title}</h3>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <AdminForm onSubmit={handleSubmit}>
        <FormGroup
          label="Name *"
          error={error && !formData.name ? 'Name is required' : ''}
        >
          <FormInput
            type="text"
            placeholder="Category Name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup label="Slug (optional)">
          <FormInput
            type="text"
            placeholder="category-slug"
            value={formData.slug || ''}
            onChange={(e) => handleInputChange('slug', e.target.value)}
          />
          <small className={styles.helpText}>
            Leave empty to auto-generate from name
          </small>
        </FormGroup>

        <div className={styles.actions}>
          <AdminButton
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/categories')}
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

export default CategoryForm
