/**
 * Admin Edit Flag Page
 * Form to edit an existing flag
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { adminFlagService, UpdateFlagData } from '@/admin/services'
import { IFlag } from '@/models/common/types'
import styles from '@/pages/admin/categories/category-form.module.scss'

const EditFlag = () => {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const [flag, setFlag] = useState<IFlag | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<UpdateFlagData>({
    id: 0,
    name: '',
    discountPercentage: 0,
  })

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  useEffect(() => {
    const fetchFlag = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const flagData = await adminFlagService.getById(parseInt(id))
        setFlag(flagData)
        setFormData({
          id: flagData.id,
          name: flagData.name,
          discountPercentage: flagData.discountPercentage,
        })
      } catch (err) {
        setError('Failed to load flag. Please try again.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchFlag()
    }
  }, [id])

  const handleInputChange = (field: keyof UpdateFlagData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name?.trim()) {
      setError('Flag name is required')
      return
    }

    if (formData.discountPercentage !== undefined && (formData.discountPercentage < 0 || formData.discountPercentage > 100)) {
      setError('Discount percentage must be between 0 and 100')
      return
    }

    setIsSubmitting(true)

    try {
      await adminFlagService.update(formData)
      router.push('/admin/flags')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update flag. Please try again.'
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

  if (!isAuthenticated || !flag) {
    return null
  }

  return (
    <AdminLayout>
      <AdminCard>
        <h3>Edit Flag</h3>

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
            error={error && formData.discountPercentage !== undefined && (formData.discountPercentage < 0 || formData.discountPercentage > 100) ? 'Discount must be between 0 and 100' : ''}
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
              Update Flag
            </AdminButton>
          </div>
        </AdminForm>
      </AdminCard>
    </AdminLayout>
  )
}

export default EditFlag

