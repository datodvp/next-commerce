/**
 * Admin Flags List Page
 * List all flags with edit/delete actions
 */

import React, { useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/admin/components/AdminLayout'
import AdminPageWrapper from '@/admin/components/AdminPageWrapper'
import AdminCard from '@/admin/components/AdminCard'
import AdminTable from '@/admin/components/AdminTable'
import AdminButton from '@/admin/components/AdminButton'
import { useFlags } from '@/hooks/api/useFlags'
import { adminFlagService } from '@/admin/services'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import styles from './flags.module.scss'

const AdminFlags = () => {
  const { flags, isLoading, mutate } = useFlags()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this flag?')) {
      return
    }

    setDeletingId(id)
    try {
      await adminFlagService.delete(id)
      mutate()
    } catch (error) {
      alert('Failed to delete flag. Please try again.')
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageWrapper loading={isLoading}>
      <AdminLayout>
      <AdminCard>
        <div className={styles.header}>
          <h3>Flags</h3>
          <Link href="/admin/flags/create">
            <AdminButton variant="primary">
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
              Add Flag
            </AdminButton>
          </Link>
        </div>

        {flags.length > 0 ? (
          <AdminTable headers={['Name', 'Discount %', 'Products', 'Actions']}>
            {flags.map((flag) => (
              <tr key={flag.id}>
                <td>
                  <span className={styles.flagName}>{flag.name}</span>
                </td>
                <td>
                  <span className={styles.discount}>
                    {flag.discountPercentage}%
                  </span>
                </td>
                <td>
                  <span className={styles.productCount}>{flag.productCount ?? 0}</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/flags/edit/${flag.id}`}>
                      <button className={styles.editButton}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(flag.id)}
                      disabled={deletingId === flag.id}
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
            <p>No flags found.</p>
            <Link href="/admin/flags/create">
              <AdminButton variant="primary">Create First Flag</AdminButton>
            </Link>
          </div>
        )}
      </AdminCard>
    </AdminLayout>
    </AdminPageWrapper>
  )
}

export default AdminFlags
