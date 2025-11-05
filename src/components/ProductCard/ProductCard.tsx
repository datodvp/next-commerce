import { IProduct } from '@/models/common/types'
import Image from 'next/image'
import styles from './ProductCard.module.scss'
import AddToCart from './AddToCart'
import Hologram from '../CartProduct/Hologram'
import Link from 'next/link'
import { API_CONFIG } from '@/api/config'

interface IProps {
  product: IProduct
}
const ProductCard = ({ product }: IProps) => {
  // Get first image or use placeholder
  const firstImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : null
  
  // Make image URL absolute if it's relative
  const imageUrl = firstImage
    ? firstImage.startsWith('http') 
      ? firstImage 
      : `${API_CONFIG.baseURL}${firstImage}`
    : null

  return (
    <Link href={`/products/${product.slug}`}>
      <Hologram>
        <section className={styles.root}>
          <div className={styles.product}>
            <div className={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.title}
                  width={170}
                  height={170}
                  unoptimized
                />
              ) : (
                <div className={styles.noImage}>No image</div>
              )}
            </div>

            {product.category && (
              <div className={styles.category}>{product.category.name}</div>
            )}
            <span className={styles.title}>{product.title}</span>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            <AddToCart product={product} />
          </div>
        </section>
      </Hologram>
    </Link>
  )
}

export default ProductCard
