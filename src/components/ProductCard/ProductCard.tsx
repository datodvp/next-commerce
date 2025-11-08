import { IProduct } from '@/models/common/types'
import Image from 'next/image'
import styles from './ProductCard.module.scss'
import AddToCart from './AddToCart'
import AddToFavourites from './AddToFavourites'
import Hologram from '../CartProduct/Hologram'
import PriceDisplay from '@/components/PriceDisplay'
import Link from 'next/link'
import { getFirstImageUrl } from '@/utils/imageUtils'

interface IProps {
  product: IProduct
}
const ProductCard = ({ product }: IProps) => {
  const imageUrl = getFirstImageUrl(product.images)

  return (
    <Hologram>
      <section className={styles.root}>
        <div className={styles.product}>
          <Link href={`/products/${product.slug}`} className={styles.cardLink}>
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
            {product.flags && product.flags.length > 0 && (
              <div className={styles.flags}>
                {product.flags.map((flag) => (
                  <span key={flag.id} className={styles.flagBadge}>
                    {flag.name}
                  </span>
                ))}
              </div>
            )}
            <span className={styles.title}>{product.title}</span>
            <PriceDisplay
              price={product.price}
              discountedPrice={product.discountedPrice}
              variant="card"
            />
          </Link>
          <div className={styles.actionsWrapper}>
            <AddToFavourites product={product} />
            <AddToCart product={product} />
          </div>
        </div>
      </section>
    </Hologram>
  )
}

export default ProductCard
