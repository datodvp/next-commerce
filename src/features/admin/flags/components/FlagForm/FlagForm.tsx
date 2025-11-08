import React from 'react'
import { useRouter } from 'next/router'
import AdminCard from '@/admin/components/AdminCard'
import AdminForm, { FormGroup, FormInput } from '@/admin/components/AdminForm'
import AdminButton from '@/admin/components/AdminButton'
import { useFlagForm } from '@/admin/hooks/useFlagForm'
import { CreateFlagData, UpdateFlagData } from '@/admin/services'
import styles from './FlagForm.module.scss'

interface FlagFormProps {
  initialData?: CreateFlagData | UpdateFlagData
  title?: string
  submitLabel?: string
  redirectTo?: string
}

const FlagForm: React.FC<FlagFormProps> = ({
  initialData,
  title = 'Create New Flag',
  submitLabel = 'Create Flag',
  redirectTo,
}) => {
  const router = useRouter()
  const { formData, isSubmitting, error, handleInputChange, handleSubmit } = useFlagForm({
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
            placeholder="e.g., Winter Sale"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup
          label="Discount Percentage *"
          error={
            error &&
            formData.discountPercentage !== undefined &&
            (formData.discountPercentage < 0 || formData.discountPercentage > 100)
              ? 'Discount must be between 0 and 100'
              : ''
          }
        >
          <FormInput
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="30"
            value={formData.discountPercentage || ''}
            onChange={(e) =>
              handleInputChange('discountPercentage', parseFloat(e.target.value) || 0)
            }
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
            {submitLabel}
          </AdminButton>
        </div>
      </AdminForm>
    </AdminCard>
  )
}

export default FlagForm
