import React from 'react'
import Link from 'next/link'
import { ICategory } from '@/models/common/types'
import { akatab } from '@/utils/fonts/fonts'
import styles from './HeaderMenu.module.scss'

interface HeaderMenuProps {
  categories: ICategory[]
  currentPath: string
  isOpen: boolean
  onClose: () => void
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  categories,
  currentPath,
  isOpen,
  onClose,
}) => {
  return (
    <>
      <section
        className={`${styles.header} ${isOpen ? styles.menuOpen : ''}`}
      >
        <div className={styles.menuTitle}>
          <Link
            href="/"
            className={`${styles.menuTitleLink} ${akatab.className}`}
            onClick={onClose}
          >
            <span className={styles.menuTitleText}>Next Commerce</span>
          </Link>
        </div>
        <section className={styles.categories}>
          <Link
            href="/"
            className={`${styles.category} ${currentPath === '/' ? styles.active : ''} ${styles.homeLink}`}
            onClick={onClose}
          >
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            className={`${styles.category} ${currentPath === '/products' ? styles.active : ''}`}
            onClick={onClose}
          >
            <span>Products</span>
          </Link>
          {categories?.slice(0, 6).map((category) => {
            const categoryPath = `/categories/${category.slug}`
            const isActive =
              currentPath === categoryPath || currentPath.startsWith(`${categoryPath}/`)

            return (
              <Link
                href={categoryPath}
                className={`${styles.category} ${isActive ? styles.active : ''}`}
                key={category.id}
                onClick={onClose}
              >
                <span>{category.name}</span>
              </Link>
            )
          })}
        </section>
      </section>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default HeaderMenu
