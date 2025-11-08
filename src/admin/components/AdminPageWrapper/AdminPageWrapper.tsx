import React from 'react'
import AdminLayout from '../AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import styles from './AdminPageWrapper.module.scss'

interface AdminPageWrapperProps {
  children: React.ReactNode
  loading?: boolean
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
  children,
  loading: externalLoading,
}) => {
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()

  React.useEffect(() => {
    if (!authLoading) {
      requireAuth()
    }
  }, [authLoading, requireAuth])

  if (authLoading || externalLoading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading...</div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default AdminPageWrapper
