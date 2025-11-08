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
  const isOnSearchPage = router.pathname === '/search'
  const lastSyncedQueryRef = useRef<string>('')
  const skipNextSyncRef = useRef(false)
  
  // Debounce the input value (400ms delay)
  const debouncedSearchQuery = useDebounce(inputValue, 400)

  // Sync input with URL when on search page (only sync from URL to input, not vice versa)
  useEffect(() => {
    if (isOnSearchPage) {
      const query = (router.query.q as string) || ''
      
      // Only sync if URL changed externally (not from our own navigation)
      if (query !== lastSyncedQueryRef.current && !skipNextSyncRef.current) {
        setInputValue(query)
        lastSyncedQueryRef.current = query
      }
      
      // Reset skip flag after sync check
      skipNextSyncRef.current = false
    }
  }, [router.query.q, isOnSearchPage])

  // Navigate to search page when debounced value changes (works from any page)
  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim()
    const currentQuery = (router.query.q as string) || ''

    // If we have a search query and it's different from current URL, navigate to search
    if (trimmedQuery && trimmedQuery !== currentQuery) {
      skipNextSyncRef.current = true // Skip syncing back since we're navigating
      lastSyncedQueryRef.current = trimmedQuery
      router.push(
        {
          pathname: '/search',
          query: { q: trimmedQuery },
        },
        undefined,
        { shallow: false },
      )
    } 
    // Only redirect to home if we're on search page, query becomes empty, and there was a previous query
    else if (!trimmedQuery && isOnSearchPage && currentQuery) {
      skipNextSyncRef.current = true
      lastSyncedQueryRef.current = ''
      // User cleared the search on search page, go to home
      router.push('/')
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
      // Navigate to search page when Enter is pressed (if not empty)
      const trimmedValue = inputValue.trim()
      if (trimmedValue) {
        skipNextSyncRef.current = true
        lastSyncedQueryRef.current = trimmedValue
        router.push({
          pathname: '/search',
          query: { q: trimmedValue },
        })
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
