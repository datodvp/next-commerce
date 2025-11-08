import { ICategory, IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import ProductList from '@/components/ProductList'
import styles from '../categories/styles.module.scss'

interface IProps {
  products: IProduct[]
}

const Products = ({ products }: IProps) => {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>
          {products.length > 0
            ? `${products.length} product${products.length !== 1 ? 's' : ''} available`
            : 'No products available'}
        </p>
      </div>
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

