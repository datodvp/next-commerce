import { IProduct } from '@/models/common/types'
import Image from 'next/image'
import styles from './ProductCard.module.scss'
import AddToCart from './AddToCart'
import Hologram from '../CartProduct/Hologram'
import Link from 'next/link'

interface IProps {
  product: IProduct
}
const ProductCard = ({ product }: IProps) => {
  return (
    <Link href={`/products/${product.slug}`}>
      <Hologram>
        <section className={styles.root}>
          <div className={styles.product}>
            <div className={styles.imageContainer}>
              <Image
                src={product.images[0].url}
                alt={product.title}
                width={170}
                height={170}
              />
            </div>

            <div className={styles.category}>{product.category?.name}</div>
            <span className={styles.title}>{product.title}</span>
            <span className={styles.price}>${product.price}</span>
            <AddToCart product={product} />
          </div>
        </section>
      </Hologram>
    </Link>
  )
}

export default ProductCard
