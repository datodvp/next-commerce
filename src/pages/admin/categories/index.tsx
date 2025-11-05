/**
 * Admin Categories List Page
 * List all categories with edit/delete actions
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminTable from '@/admin/components/AdminTable'
import AdminButton from '@/admin/components/AdminButton'
import { useCategories } from '@/hooks/api/useCategories'
import { adminCategoryService } from '@/admin/services'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import styles from './categories.module.scss'

const AdminCategories = () => {
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const { categories, isLoading, mutate } = useCategories()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    setDeletingId(id)
    try {
      await adminCategoryService.delete(id)
      mutate()
    } catch (error) {
      alert('Failed to delete category. Please try again.')
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading || isLoading) {
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
      <AdminCard>
        <div className={styles.header}>
          <h3>Categories</h3>
          <Link href="/admin/categories/create">
            <AdminButton variant="primary">
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
              Add Category
            </AdminButton>
          </Link>
        </div>

        {categories && categories.length > 0 ? (
          <AdminTable headers={['ID', 'Name', 'Slug', 'Actions']}>
            {categories.map((category: import('@/models/common/types').ICategory) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  <span className={styles.categoryName}>{category.name}</span>
                </td>
                <td>
                  <span className={styles.categorySlug}>{category.slug}</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/categories/edit/${category.id}`}>
                      <button className={styles.editButton}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        ) : (
          <div className={styles.empty}>
            <p>No categories found.</p>
            <Link href="/admin/categories/create">
              <AdminButton variant="primary">Create First Category</AdminButton>
            </Link>
          </div>
        )}
      </AdminCard>
    </AdminLayout>
  )
}

export default AdminCategories

