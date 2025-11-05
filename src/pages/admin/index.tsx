/**
 * Admin Dashboard Page
 * Main dashboard for admin panel
 */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import { useProducts } from '@/hooks/api/useProducts'
import { useCategories } from '@/hooks/api/useCategories'
import styles from './dashboard.module.scss'

const AdminDashboard = () => {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const { products, isLoading: productsLoading } = useProducts()
  const { categories, isLoading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

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
      <div className={styles.dashboard}>
        <div className={styles.stats}>
          <AdminCard className={styles.statCard}>
            <div className={styles.statValue}>
              {productsLoading ? '...' : products.length || 0}
            </div>
            <div className={styles.statLabel}>Total Products</div>
          </AdminCard>

          <AdminCard className={styles.statCard}>
            <div className={styles.statValue}>
              {categoriesLoading ? '...' : categories.length || 0}
            </div>
            <div className={styles.statLabel}>Total Categories</div>
          </AdminCard>
        </div>

        <div className={styles.actions}>
          <AdminCard>
            <h3>Quick Actions</h3>
            <div className={styles.actionButtons}>
              <button
                onClick={() => router.push('/admin/products/create')}
                className={styles.actionButton}
              >
                Create New Product
              </button>
              <button
                onClick={() => router.push('/admin/categories/create')}
                className={styles.actionButton}
              >
                Create New Category
              </button>
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

