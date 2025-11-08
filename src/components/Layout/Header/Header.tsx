import React from 'react'
import { ICategory } from '@/models/common/types'
import styles from './Header.module.scss'
import SearchInput from '@/components/Layout/SearchInput'
import { useRouter } from 'next/router'
import Title from '@/components/Layout/Title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { useMenuToggle } from '@/shared/hooks/useMenuToggle'
import HeaderMenu from './HeaderMenu'
import HeaderActions from './HeaderActions'

interface IProps {
  categories: ICategory[]
}

const Header = ({ categories }: IProps) => {
  const router = useRouter()
  const asPath = router.asPath
  const { isMenuOpen, toggleMenu, closeMenu } = useMenuToggle({
    onRouteChange: () => {
      // Menu will be closed when route changes via useEffect in useMenuToggle
    },
  })

  // Close menu when route changes
  React.useEffect(() => {
    closeMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath])

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
          <div className={styles.desktopSearch}>
            <SearchInput />
          </div>
          <HeaderActions />
        </section>
        <section className={styles.searchSection}>
          <SearchInput />
        </section>
      </div>
      <HeaderMenu
        categories={categories}
        currentPath={asPath}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />
    </>
  )
}

export default Header
