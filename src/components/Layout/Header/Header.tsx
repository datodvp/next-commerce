import { ICategory } from '@/models/common/types'
import styles from './Header.module.scss'
import SearchInput from '@/components/Layout/SearchInput'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Title from '@/components/Layout/Title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCartShopping,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { useAppSelector } from '@/stores'
import { useState, useEffect } from 'react'
import { akatab } from '@/utils/fonts/fonts'

interface IProps {
  categories: ICategory[]
}

const Header = ({ categories }: IProps) => {
  const router = useRouter()
  const asPath = router.asPath
  const cartStore = useAppSelector((state) => state.cart)
  const favouritesStore = useAppSelector((state) => state.favourites)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [asPath])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <div className={styles.stickyContainer}>
        <section className={styles.fixedHeader}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuButton}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <FontAwesomeIcon
                icon={isMenuOpen ? faTimes : faBars}
                width={24}
                height={24}
              />
            </button>
            <Title />
          </div>
          <div className={styles.headerRight}>
            <div className={styles.desktopSearch}>
              <SearchInput />
            </div>
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
        </section>
        <section className={styles.searchSection}>
          <SearchInput />
        </section>
      </div>
      <section
        className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}
      >
        <div className={styles.menuTitle}>
          <Link
            href="/"
            className={`${styles.menuTitleLink} ${akatab.className}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.menuTitleText}>Next Commerce</span>
          </Link>
        </div>
        <section className={styles.categories}>
          <Link
            href="/"
            className={`${styles.category} ${asPath === '/' ? styles.active : ''} ${styles.homeLink}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Home</span>
          </Link>
          {categories?.slice(0, 6).map((category) => {
            const categoryPath = `/categories/${category.slug}`
            const isActive =
              asPath === categoryPath || asPath.startsWith(`${categoryPath}/`)

            return (
              <Link
                href={categoryPath}
                className={`${styles.category} ${isActive ? styles.active : ''}`}
                key={category.id}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{category.name}</span>
              </Link>
            )
          })}
        </section>
      </section>
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Header
