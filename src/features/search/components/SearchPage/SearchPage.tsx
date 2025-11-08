import { IProduct } from '@/models/common/types'
import Breadcrumb from '@/components/Breadcrumb'
import ProductList from '@/components/ProductList'
import { createSearchBreadcrumbs } from '@/utils/breadcrumbUtils'
import styles from './SearchPage.module.scss'

interface SearchPageProps {
  searchQuery: string
  products: IProduct[]
}

const SearchPage = ({ searchQuery, products }: SearchPageProps) => {
  // If no search query, show a message to start searching
  if (!searchQuery || !searchQuery.trim()) {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Search' },
    ]

    return (
      <section className={styles.root}>
        <Breadcrumb items={breadcrumbs} />

        <div className={styles.header}>
          <h1 className={styles.title}>Search Products</h1>
          <p className={styles.subtitle}>
            Start typing in the search bar to find products
          </p>
        </div>

        <ProductList products={[]} />
      </section>
    )
  }

  const breadcrumbs = createSearchBreadcrumbs(searchQuery)

  return (
    <section className={styles.root}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.header}>
        <h1 className={styles.title}>Search Results</h1>
        <p className={styles.subtitle}>
          {products.length > 0 ? (
            <>
              Found <strong>{products.length}</strong>{' '}
              {products.length === 1 ? 'result' : 'results'} for &quot;
              <strong>{searchQuery}</strong>&quot;
            </>
          ) : (
            <>
              No results found for &quot;<strong>{searchQuery}</strong>&quot;. Try
              searching for something else.
            </>
          )}
        </p>
      </div>

      <ProductList products={products} />
    </section>
  )
}

export default SearchPage

