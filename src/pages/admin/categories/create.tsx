/**
 * Admin Create Category Page
 * Form to create a new category
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { adminCategoryService, CreateCategoryData } from '@/admin/services'
import styles from '@/pages/admin/categories/category-form.module.scss'

const CreateCategory = () => {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    slug: '',
  })

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  const handleInputChange = (field: keyof CreateCategoryData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Category name is required')
      return
    }

    setIsSubmitting(true)

    try {
      await adminCategoryService.create(formData)
      // Revalidate categories list cache before redirect
      await mutate('categories/all')
      router.push('/admin/categories')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
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
        <h3>Create New Category</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <AdminForm onSubmit={handleSubmit}>
          <FormGroup label="Name *" error={error && !formData.name ? 'Name is required' : ''}>
            <FormInput
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="Slug (optional)">
            <FormInput
              type="text"
              placeholder="category-slug"
              value={formData.slug}
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
              Create Category
            </AdminButton>
          </div>
        </AdminForm>
      </AdminCard>
    </AdminLayout>
  )
}

export default CreateCategory

