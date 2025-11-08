import Link from 'next/link'
import { IProduct } from '@/models/common/types'
import ProductCard from '../ProductCard'
import styles from './ProductList.module.scss'

interface IProps {
  products: IProduct[]
}

const ProductList = ({ products }: IProps) => {
  if (!products || products.length === 0) {
    return (
      <section className={styles.root}>
        <div className={styles.emptyState}>
          <h2 className={styles.title}>No Products Found</h2>
          <p className={styles.message}>
            We couldn&apos;t find any products matching your search.
          </p>
          <p className={styles.message}>
            <Link href="/products" className={styles.link}>
              Browse all products
            </Link>{' '}
            or try a different search term.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.root}>
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </section>
  )
}

export default ProductList
