import { ICategory, IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import ProductList from '@/components/ProductList'
import Link from 'next/link'
import styles from '../categories/styles.module.scss'

interface IProps {
  products: IProduct[]
}

const Products = ({ products }: IProps) => {
  return (
    <section className={styles.root}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>Products</span>
      </nav>

      {/* Products Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>
          {products.length > 0 ? (
            <>
              Discover our complete collection of <strong>{products.length}</strong>{' '}
              {products.length === 1 ? 'product' : 'products'}
            </>
          ) : (
            'No products available at the moment'
          )}
        </p>
      </div>

      {/* Product List */}
      <ProductList products={products} />
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
    console.error('Error fetching products:', error)
    return {
      props: {
        categories: [],
        products: [],
      },
    }
  }
}

export default Products

