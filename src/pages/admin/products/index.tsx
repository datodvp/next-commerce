/**
 * Admin Products List Page
 * List all products with edit/delete actions
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/admin/components/AdminLayout'
import { useAdminAuth } from '@/admin/hooks/useAdminAuth'
import AdminCard from '@/admin/components/AdminCard'
import AdminTable from '@/admin/components/AdminTable'
import AdminButton from '@/admin/components/AdminButton'
import { useProducts } from '@/hooks/api/useProducts'
import { adminProductService } from '@/admin/services'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { API_CONFIG } from '@/api/config'
import styles from './products.module.scss'

const AdminProducts = () => {
  const { isAuthenticated, loading: authLoading, requireAuth } = useAdminAuth()
  const { products, isLoading, mutate } = useProducts()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    if (!authLoading && !requireAuth()) {
      return
    }
  }, [authLoading, requireAuth])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeletingId(id)
    try {
      await adminProductService.delete(id)
      mutate()
    } catch (error) {
      alert('Failed to delete product. Please try again.')
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
          <h3>Products</h3>
          <Link href="/admin/products/create">
            <AdminButton variant="primary">
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
              Add Product
            </AdminButton>
          </Link>
        </div>

        {products && products.length > 0 ? (
          <AdminTable headers={['Image', 'ID', 'Title', 'Price', 'Category', 'Stock', 'Actions']}>
            {products.map((product: import('@/models/common/types').IProduct) => {
              // Get first image or use placeholder
              const firstImage = product.images && product.images.length > 0 
                ? product.images[0].url 
                : null
              
              // Make image URL absolute if it's relative
              const imageUrl = firstImage
                ? firstImage.startsWith('http') 
                  ? firstImage 
                  : `${API_CONFIG.baseURL}${firstImage}`
                : null

              return (
                <tr key={product.id}>
                  <td>
                    <div className={styles.imageCell}>
                      {imageUrl ? (
                        <Image 
                          src={imageUrl} 
                          alt={product.title}
                          width={50}
                          height={50}
                          className={styles.productImage}
                          unoptimized
                        />
                      ) : (
                        <div className={styles.noImage}>
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{product.id}</td>
                  <td>
                    <div className={styles.productInfo}>
                      <span className={styles.productTitle}>{product.title}</span>
                      <span className={styles.productSlug}>{product.slug}</span>
                    </div>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>{product.stock || 0}</td>
                  <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <button className={styles.editButton}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  </td>
                </tr>
              )
            })}
          </AdminTable>
        ) : (
          <div className={styles.empty}>
            <p>No products found.</p>
            <Link href="/admin/products/create">
              <AdminButton variant="primary">Create First Product</AdminButton>
            </Link>
          </div>
        )}
      </AdminCard>
    </AdminLayout>
  )
}

export default AdminProducts

