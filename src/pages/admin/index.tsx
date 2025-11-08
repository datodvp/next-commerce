/**
 * Admin Dashboard Page
 * Main dashboard for admin panel
 */

import React from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import AdminCard from '@/admin/components/AdminCard'
import { useProducts } from '@/hooks/api/useProducts'
import { useCategories } from '@/hooks/api/useCategories'
import { useFlags } from '@/hooks/api/useFlags'
import styles from './dashboard.module.scss'

const AdminDashboard = () => {
  const router = useRouter()
  const { products, isLoading: productsLoading } = useProducts()
  const { categories, isLoading: categoriesLoading } = useCategories()
  const { flags, isLoading: flagsLoading } = useFlags()

  return (
    <AdminPageWrapper loading={productsLoading || categoriesLoading || flagsLoading}>
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

            <AdminCard className={styles.statCard}>
              <div className={styles.statValue}>
                {flagsLoading ? '...' : flags.length || 0}
              </div>
              <div className={styles.statLabel}>Total Flags</div>
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
                <button
                  onClick={() => router.push('/admin/flags/create')}
                  className={styles.actionButton}
                >
                  Create New Flag
                </button>
              </div>
            </AdminCard>
          </div>
        </div>
      </AdminLayout>
    </AdminPageWrapper>
  )
}

export default AdminDashboard

