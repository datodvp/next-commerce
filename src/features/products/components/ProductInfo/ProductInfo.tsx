import React from 'react'
import { IProduct } from '@/models/common/types'
import PriceDisplay from '@/components/PriceDisplay'
import AddToCartDetail from '@/components/ProductCard/AddToCartDetail'
import ProductFlags from '../ProductFlags'
import styles from './ProductInfo.module.scss'

interface ProductInfoProps {
  product: IProduct
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div className={styles.infoSection}>
      <h1 className={styles.title}>{product.title}</h1>
      
      {product.category && (
        <h2 className={styles.category}>{product.category.name}</h2>
      )}

      {product.flags && <ProductFlags flags={product.flags} />}

      <PriceDisplay
        price={product.price}
        discountedPrice={product.discountedPrice}
      />

      {product.description && (
        <div className={styles.description}>
          <span className={styles.label}>Description</span>
          <p>{product.description}</p>
        </div>
      )}

      <AddToCartDetail product={product} />
    </div>
  )
}

export default ProductInfo
