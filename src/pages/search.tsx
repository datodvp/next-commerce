import { IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import SearchPage from '@/features/search/components/SearchPage'

interface IProps {
  searchQuery: string
  products: IProduct[]
}

const Search = ({ searchQuery, products }: IProps) => {
  return <SearchPage searchQuery={searchQuery} products={products} />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { q } = ctx.query
    const searchQuery = (q as string) || ''

    // Fetch categories (required for Layout) - always fetch even if no query
    const categories = await CategoryService.getAll()

    // If no search query, show empty results instead of redirecting
    // This prevents redirect loops and allows the search page to handle empty state
    if (!searchQuery.trim()) {
      return {
        props: {
          categories,
          searchQuery: '',
          products: [],
        },
      }
    }

    // Search for products
    const products = await ProductService.search(searchQuery.trim())

    return {
      props: {
        categories,
        searchQuery: searchQuery.trim(),
        products,
      },
    }
  } catch (error) {
    console.error('Error fetching search results:', error)
    // Always return valid props instead of redirecting
    const categories = await CategoryService.getAll().catch(() => [])
    return {
      props: {
        categories: Array.isArray(categories) ? categories : [],
        searchQuery: (ctx.query.q as string) || '',
        products: [],
      },
    }
  }
}

export default Search

