/**
 * Admin Create Flag Page
 * Form to create a new flag
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { adminFlagService, CreateFlagData } from '@/admin/services'
import styles from '@/pages/admin/categories/category-form.module.scss'

const CreateFlag = () => {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<CreateFlagData>({
    name: '',
    discountPercentage: 0,
  })

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  const handleInputChange = (field: keyof CreateFlagData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Flag name is required')
      return
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      setError('Discount percentage must be between 0 and 100')
      return
    }

    setIsSubmitting(true)

    try {
      await adminFlagService.create(formData)
      // Revalidate flags list cache before redirect
      await mutate('flags/all')
      router.push('/admin/flags')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flag. Please try again.'
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
        <h3>Create New Flag</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <AdminForm onSubmit={handleSubmit}>
          <FormGroup label="Name *" error={error && !formData.name ? 'Name is required' : ''}>
            <FormInput
              type="text"
              placeholder="e.g., Winter Sale"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup 
            label="Discount Percentage *" 
            error={error && (formData.discountPercentage < 0 || formData.discountPercentage > 100) ? 'Discount must be between 0 and 100' : ''}
          >
            <FormInput
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="30"
              value={formData.discountPercentage || ''}
              onChange={(e) => handleInputChange('discountPercentage', parseFloat(e.target.value) || 0)}
              required
            />
            <small className={styles.helpText}>
              Enter a percentage between 0 and 100 (e.g., 30 for 30% off)
            </small>
          </FormGroup>

          <div className={styles.actions}>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/flags')}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={isSubmitting}>
              Create Flag
            </AdminButton>
          </div>
        </AdminForm>
      </AdminCard>
    </AdminLayout>
  )
}

export default CreateFlag

