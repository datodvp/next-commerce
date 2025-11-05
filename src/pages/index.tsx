import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { ICategory, IProduct } from '@/models/common/types'
import { GetServerSideProps } from 'next'
import { CategoryService, ProductService } from '@/services'
import ProductList from '@/components/ProductList'

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

  return (
    <section>
      {searchQuery && (
        <div style={{ marginBottom: '1rem', padding: '0 1rem' }}>
          <p>
            {filteredProducts.length > 0
              ? `Found ${filteredProducts.length} product${
                  filteredProducts.length !== 1 ? 's' : ''
                } for "${searchQuery}"`
              : `No products found for "${searchQuery}"`}
          </p>
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
