/**
 * Admin Create Category Page
 * Form to create a new category
 */

import React from 'react'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import CategoryForm from '@/features/admin/categories/components/CategoryForm'

const CreateCategory = () => {
  return (
    <AdminPageWrapper>
      <AdminLayout>
        <CategoryForm />
      </AdminLayout>
    </AdminPageWrapper>
  )
}

export default CreateCategory

