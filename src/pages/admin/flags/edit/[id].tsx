/**
 * Admin Edit Flag Page
 * Form to edit an existing flag
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import { adminFlagService } from '@/admin/services'
import FlagForm from '@/features/admin/flags/components/FlagForm'

const EditFlag = () => {
  const router = useRouter()
  const { id } = router.query
  const [initialData, setInitialData] = useState<{
    id: number
    name: string
    discountPercentage: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFlag = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const flagData = await adminFlagService.getById(parseInt(id))
        setInitialData({
          id: flagData.id,
          name: flagData.name,
          discountPercentage: flagData.discountPercentage,
        })
      } catch (err) {
        console.error('Failed to load flag:', err)
        router.push('/admin/flags')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchFlag()
    }
  }, [id, router])

  if (!initialData) {
    return (
      <AdminPageWrapper loading={isLoading}>
        <AdminLayout>
          <div>Loading flag...</div>
        </AdminLayout>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminLayout>
        <FlagForm
          initialData={initialData}
          title="Edit Flag"
          submitLabel="Update Flag"
          redirectTo="/admin/flags"
        />
      </AdminLayout>
    </AdminPageWrapper>
  )
}

export default EditFlag

