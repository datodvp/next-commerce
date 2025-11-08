import { useState, useEffect, useCallback } from 'react'

interface UseMenuToggleOptions {
  onRouteChange?: () => void
}

export const useMenuToggle = (options?: UseMenuToggleOptions) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    if (options?.onRouteChange) {
      options.onRouteChange()
    }
  }, [options])

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

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
  }
}
