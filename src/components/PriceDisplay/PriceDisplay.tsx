import { formatPrice } from '@/utils/priceUtils'
import styles from './PriceDisplay.module.scss'

interface PriceDisplayProps {
  price: number
  discountedPrice?: number
  variant?: 'default' | 'inline' | 'card'
  showCurrency?: boolean
}

const PriceDisplay = ({
  price,
  discountedPrice,
  variant = 'default',
  showCurrency = true,
}: PriceDisplayProps) => {
  const hasDiscount = discountedPrice !== undefined && discountedPrice < price
  const currencySymbol = showCurrency ? '$' : ''

  if (variant === 'inline') {
    return (
      <div className={styles.inline}>
        {hasDiscount ? (
          <>
            <span className={styles.discountedPrice}>
              {currencySymbol}
              {formatPrice(discountedPrice!)}
            </span>
            <span className={styles.originalPrice}>
              {currencySymbol}
              {formatPrice(price)}
            </span>
          </>
        ) : (
          <span className={styles.price}>
            {currencySymbol}
            {formatPrice(price)}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={styles.card}>
        {hasDiscount ? (
          <>
            <span className={styles.originalPrice}>
              {currencySymbol}
              {formatPrice(price)}
            </span>
            <span className={styles.discountedPrice}>
              {currencySymbol}
              {formatPrice(discountedPrice!)}
            </span>
          </>
        ) : (
          <span className={styles.price}>
            {currencySymbol}
            {formatPrice(price)}
          </span>
        )}
      </div>
    )
  }

  // Default variant (for product detail page)
  return (
    <div className={styles.default}>
      {hasDiscount ? (
        <>
          <div className={styles.discountedPriceContainer}>
            <span className={styles.dollarSymbol}>{currencySymbol}</span>
            <span className={styles.discountedPrice}>
              {formatPrice(discountedPrice!)}
            </span>
          </div>
          <div className={styles.originalPriceContainer}>
            <span className={styles.originalPriceLabel}>Was:</span>
            <span className={styles.originalPrice}>
              {currencySymbol}
              {formatPrice(price)}
            </span>
          </div>
        </>
      ) : (
        <>
          <span className={styles.dollarSymbol}>{currencySymbol}</span>
          <span>{formatPrice(price)}</span>
        </>
      )}
    </div>
  )
}

export default PriceDisplay

