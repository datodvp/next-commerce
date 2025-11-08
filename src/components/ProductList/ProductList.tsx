import { IProduct } from '@/models/common/types'
import ProductCard from '../ProductCard'
import EmptyState from '../EmptyState'
import styles from './ProductList.module.scss'

interface IProps {
  products: IProduct[]
}

const ProductList = ({ products }: IProps) => {
  if (!products || products.length === 0) {
    return (
      <section className={styles.emptyContainer}>
        <EmptyState
          title="No Products Found"
          message="We couldn't find any products matching your search."
          actionLabel="Browse all products"
          actionHref="/products"
        />
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
