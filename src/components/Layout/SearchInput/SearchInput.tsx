import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './SearchInput.module.scss'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '@/hooks/useDebounce'

const SearchInput = () => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Debounce the input value (300ms delay)
  const debouncedSearchQuery = useDebounce(inputValue, 400)

  // Initialize input value from URL on mount
  useEffect(() => {
    const query = (router.query.search as string) || ''
    setInputValue(query)
  }, [router.query.search])

  // Update URL when debounced value changes
  useEffect(() => {
    // Skip if debounced value matches current URL query (prevents unnecessary updates)
    const currentQuery = (router.query.search as string) || ''
    if (debouncedSearchQuery.trim() === currentQuery) {
      return
    }

    // Update URL query parameter without page reload
    if (debouncedSearchQuery.trim()) {
      router.push(
        {
          pathname: router.pathname === '/' ? '/' : '/',
          query: { ...router.query, search: debouncedSearchQuery.trim() },
        },
        undefined,
        { shallow: true },
      )
    } else {
      // Remove search param if empty
      const restQuery = { ...router.query }
      delete restQuery.search
      router.push(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery])

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
      // Immediately update URL on Enter (bypass debounce)
      if (inputValue.trim()) {
        router.push(
          {
            pathname: router.pathname === '/' ? '/' : '/',
            query: { ...router.query, search: inputValue.trim() },
          },
          undefined,
          { shallow: true },
        )
      } else {
        const restQuery = { ...router.query }
        delete restQuery.search
        router.push(
          {
            pathname: router.pathname,
            query: restQuery,
          },
          undefined,
          { shallow: true },
        )
      }
    }
  }

  return (
    <section className={styles.root}>
      <div className={styles.search}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <FontAwesomeIcon
          width={16}
          height={16}
          className={styles.icon}
          icon={faMagnifyingGlass}
        />
      </div>
    </section>
  )
}

export default SearchInput
