import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ICategory, IProduct } from '@/models/common/types'
import { GetServerSideProps } from 'next'
import { CategoryService, ProductService } from '@/services'
import ProductList from '@/components/ProductList'
import styles from './styles.module.scss'

interface IProps {
  categories: ICategory[]
  products: IProduct[]
}

const Home = ({ products }: IProps) => {
  const router = useRouter()
  const searchQuery = (router.query.search as string) || ''

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products
    }

    const query = searchQuery.toLowerCase().trim()
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.name.toLowerCase().includes(query),
    )
  }, [products, searchQuery])

  const handleClearSearch = () => {
    router.push('/', undefined, { shallow: true })
  }

  return (
    <section className={styles.root}>
      {searchQuery && (
        <div className={styles.searchResults}>
          {filteredProducts.length > 0 ? (
            <p className={styles.message}>
              Found <span className={styles.count}>{filteredProducts.length}</span>{' '}
              product{filteredProducts.length !== 1 ? 's' : ''} for{' '}
              <span className={styles.query}>&quot;{searchQuery}&quot;</span>
            </p>
          ) : (
            <div>
              <p className={`${styles.message} ${styles.noResults}`}>
                No products found for <span className={styles.query}>&quot;{searchQuery}&quot;</span>
              </p>
              <p className={`${styles.message} ${styles.noResultsMessage}`}>
                Try a different search term or{' '}
                <Link href="/" className={styles.link} aria-label="Browse all products">
                  browse all products
                </Link>
              </p>
            </div>
          )}
          <button
            onClick={handleClearSearch}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            Clear search
          </button>
        </div>
      )}
      <ProductList products={filteredProducts} />
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [categories, products] = await Promise.all([
      CategoryService.getAll(),
      ProductService.getAll(),
    ])

    return {
      props: {
        categories,
        products,
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        categories: [],
        products: [],
      },
    }
  }
}

export default Home
