/**
 * Admin Edit Category Page
 * Form to edit an existing category
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import { adminCategoryService } from '@/admin/services'
import CategoryForm from '@/features/admin/categories/components/CategoryForm'

const EditCategory = () => {
  const router = useRouter()
  const { id } = router.query
  const [initialData, setInitialData] = useState<{
    id: number
    name: string
    slug: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const categoryData = await adminCategoryService.getById(parseInt(id))
        setInitialData({
          id: categoryData.id,
          name: categoryData.name,
          slug: categoryData.slug,
        })
      } catch (err) {
        console.error('Failed to load category:', err)
        router.push('/admin/categories')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCategory()
    }
  }, [id, router])

  if (!initialData) {
    return (
      <AdminPageWrapper loading={isLoading}>
        <AdminLayout>
          <div>Loading category...</div>
        </AdminLayout>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminLayout>
        <CategoryForm
          initialData={initialData}
          title="Edit Category"
          submitLabel="Update Category"
          redirectTo="/admin/categories"
        />
      </AdminLayout>
    </AdminPageWrapper>
  )
}

export default EditCategory

