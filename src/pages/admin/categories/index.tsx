/**
 * Admin Categories List Page
 * List all categories with edit/delete actions
 */

import React, { useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import AdminCard from '@/admin/components/AdminCard'
import AdminTable from '@/admin/components/AdminTable'
import AdminButton from '@/admin/components/AdminButton'
import { useCategories } from '@/hooks/api/useCategories'
import { adminCategoryService, UpdateCategoryOrderData } from '@/admin/services'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { ICategory } from '@/models/common/types'
import styles from './categories.module.scss'

const AdminCategories = () => {
  const { categories, isLoading, mutate } = useCategories()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)

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

  const handleMoveUp = async (category: ICategory, index: number) => {
    if (index === 0 || !categories) return

    const prevCategory = categories[index - 1]
    await handleReorder(category, prevCategory)
  }

  const handleMoveDown = async (category: ICategory, index: number) => {
    if (!categories || index === categories.length - 1) return

    const nextCategory = categories[index + 1]
    await handleReorder(category, nextCategory)
  }

  const handleReorder = async (category1: ICategory, category2: ICategory) => {
    if (reordering) return

    setReordering(true)
    try {
      // Swap the orders, using index as fallback if order is missing
      const order1 = category1.order ?? category1.id
      const order2 = category2.order ?? category2.id
      const updateData: UpdateCategoryOrderData = {
        categories: [
          { id: category1.id, order: order2 },
          { id: category2.id, order: order1 },
        ],
      }
      await adminCategoryService.updateOrder(updateData)
      mutate()
    } catch (error) {
      alert('Failed to update category order. Please try again.')
      console.error(error)
    } finally {
      setReordering(false)
    }
  }

  return (
    <AdminPageWrapper loading={isLoading}>
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
          <AdminTable headers={['Order', 'Name', 'Slug', 'Products', 'Actions']}>
            {categories.map((category: ICategory, index: number) => (
              <tr key={category.id}>
                <td>
                  <div className={styles.orderControls}>
                    <span className={styles.orderNumber}>{category.order ?? index}</span>
                    <div className={styles.orderButtons}>
                      <button
                        className={styles.orderButton}
                        onClick={() => handleMoveUp(category, index)}
                        disabled={reordering || index === 0}
                        title="Move up"
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </button>
                      <button
                        className={styles.orderButton}
                        onClick={() => handleMoveDown(category, index)}
                        disabled={reordering || index === categories.length - 1}
                        title="Move down"
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.categoryName}>{category.name}</span>
                </td>
                <td>
                  <span className={styles.categorySlug}>{category.slug}</span>
                </td>
                <td>
                  <span className={styles.productCount}>{category.productCount ?? 0}</span>
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
                      disabled={deletingId === category.id || reordering}
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
    </AdminPageWrapper>
  )
}

export default AdminCategories

