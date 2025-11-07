/**
 * Admin Edit Category Page
 * Form to edit an existing category
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { adminCategoryService, UpdateCategoryData } from '@/admin/services'
import { ICategory } from '@/models/common/types'
import styles from '@/pages/admin/categories/category-form.module.scss'

const EditCategory = () => {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const [category, setCategory] = useState<ICategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<UpdateCategoryData>({
    id: 0,
    name: '',
    slug: '',
  })

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const categoryData = await adminCategoryService.getById(parseInt(id))
        setCategory(categoryData)
        setFormData({
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
        })
      } catch (err) {
        setError('Failed to load category. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCategory()
    }
  }, [id])

  const handleInputChange = (field: keyof UpdateCategoryData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name?.trim()) {
      setError('Category name is required')
      return
    }

    setIsSubmitting(true)

    try {
      await adminCategoryService.update(formData)
      // Revalidate categories list cache before redirect
      await mutate('categories/all')
      router.push('/admin/categories')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading...</div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated || !category) {
    return null
  }

  return (
    <AdminLayout>
      <AdminCard>
        <h3>Edit Category</h3>

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

          <FormGroup label="Slug">
            <FormInput
              type="text"
              placeholder="category-slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
            />
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
              Update Category
            </AdminButton>
          </div>
        </AdminForm>
      </AdminCard>
    </AdminLayout>
  )
}

export default EditCategory

