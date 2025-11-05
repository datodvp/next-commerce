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
        <p>No products found.</p>
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
