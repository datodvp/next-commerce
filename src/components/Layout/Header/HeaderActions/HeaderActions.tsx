import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector } from '@/stores'
import styles from './HeaderActions.module.scss'

const HeaderActions: React.FC = () => {
  const cartStore = useAppSelector((state) => state.cart)
  const favouritesStore = useAppSelector((state) => state.favourites)

  return (
    <div className={styles.headerRight}>
      <Link href="/favourites" className={styles.favouritesContainer}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3d7277"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.heartIcon}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {favouritesStore.products.length > 0 && (
          <span className={styles.favouritesBadge}>
            {favouritesStore.products.length}
          </span>
        )}
      </Link>
      <Link href="/cart" className={styles.cartContainer}>
        <FontAwesomeIcon
          icon={faCartShopping}
          width="22"
          height="22"
          fontSize={22}
          color="#3d7277"
        />
        {cartStore.totalProducts > 0 && (
          <span className={styles.cartBadge}>
            {cartStore.totalProducts}
          </span>
        )}
      </Link>
    </div>
  )
}

export default HeaderActions
