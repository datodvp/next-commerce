/**
 * Admin Create Product Page
 * Form to create a new product
 */

import React from 'react'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import ProductForm from '@/features/admin/products/components/ProductForm'

const CreateProduct = () => {
  return (
    <AdminPageWrapper>
      <AdminLayout>
        <ProductForm />
      </AdminLayout>
    </AdminPageWrapper>
  )
}

export default CreateProduct
