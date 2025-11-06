/**
 * Admin Layout Component
 * Layout wrapper for admin pages with navigation
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faTags,
  faSignOutAlt,
  faHome,
  faFlag,
} from '@fortawesome/free-solid-svg-icons'
import styles from './AdminLayout.module.scss'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter()
  const { user, logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: faHome },
    { href: '/admin/products', label: 'Products', icon: faBox },
    { href: '/admin/categories', label: 'Categories', icon: faTags },
    { href: '/admin/flags', label: 'Flags', icon: faFlag },
  ]

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'Admin'}</span>
            <span className={styles.userEmail}>{user?.email || ''}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.pageTitle}>
            {router.pathname === '/admin' && 'Dashboard'}
            {router.pathname === '/admin/products' && 'Products'}
            {router.pathname.startsWith('/admin/products/create') && 'Create Product'}
            {router.pathname.startsWith('/admin/products/edit') && 'Edit Product'}
            {router.pathname === '/admin/categories' && 'Categories'}
            {router.pathname.startsWith('/admin/categories/create') && 'Create Category'}
            {router.pathname.startsWith('/admin/categories/edit') && 'Edit Category'}
            {router.pathname === '/admin/flags' && 'Flags'}
            {router.pathname.startsWith('/admin/flags/create') && 'Create Flag'}
            {router.pathname.startsWith('/admin/flags/edit') && 'Edit Flag'}
          </h2>
        </header>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout

