import { ICategory } from '@/models/common/types'
import styles from './Header.module.scss'
import SearchInput from '@/components/Layout/SearchInput'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Title from '@/components/Layout/Title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector } from '@/stores'
import { useState, useEffect } from 'react'
import { akatab } from '@/utils/fonts/fonts'

interface IProps {
  categories: ICategory[]
}

const Header = ({ categories }: IProps) => {
  const router = useRouter()
  const pathname = router.pathname
  const cartStore = useAppSelector((state) => state.cart)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

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
          <SearchInput />
          <Link href="/cart" className={styles.cartContainer}>
            <FontAwesomeIcon
              icon={faCartShopping}
              width={28}
              height={28}
              fontSize={28}
              color="#3d7277"
            />
            {cartStore.totalProducts > 0 && (
              <span className={styles.cartBadge}>{cartStore.totalProducts}</span>
            )}
          </Link>
        </div>
      </section>
      <section className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.menuTitle}>
          <Link href="/" className={`${styles.menuTitleLink} ${akatab.className}`} onClick={() => setIsMenuOpen(false)}>
            <span className={styles.menuTitleText}>Next Commerce</span>
          </Link>
        </div>
        <section className={styles.categories}>
          <Link
            href="/"
            className={`${styles.category} ${pathname === '/' ? styles.active : ''} ${styles.homeLink}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Home</span>
          </Link>
          {categories?.slice(0, 6).map((category) => {
            const isActive = pathname.includes(category.slug)

            return (
              <Link
                href={`/categories/${category.slug}`}
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
        <div className={styles.overlay} onClick={toggleMenu} aria-hidden="true" />
      )}
    </>
  )
}

export default Header
