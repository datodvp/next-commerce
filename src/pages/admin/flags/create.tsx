/**
 * Admin Create Flag Page
 * Form to create a new flag
 */

import React from 'react'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import FlagForm from '@/features/admin/flags/components/FlagForm'

const CreateFlag = () => {
  return (
    <AdminPageWrapper>
      <AdminLayout>
        <FlagForm />
      </AdminLayout>
    </AdminPageWrapper>
  )
}

export default CreateFlag

