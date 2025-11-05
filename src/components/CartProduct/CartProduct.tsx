import React from 'react'
import { addProduct, IProductWithQuantity, removeProduct } from '@/stores/cart'
import Image from 'next/image'
import styles from './CartProduct.module.scss'
import { useAppDispatch } from '@/stores'

interface IProps {
  product: IProductWithQuantity
}

const CartProduct = ({ product }: IProps): React.ReactElement => {
  const dispatch = useAppDispatch()

  const addToCart = () => {
    dispatch(addProduct(product))
  }

  const removeFromCart = () => {
    dispatch(removeProduct(product))
  }

  return (
    <div className={styles.root}>
      <div className={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            width={150}
            height={150}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.noImage}>No image</div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{product.title}</span>
        <span className={styles.description}>{product.description}</span>
        <span className={styles.price}>$ {product.price.toFixed(2)}</span>
        <div className={styles.addition}>
          <button
            onClick={() => addToCart()}
            className={styles.action}
            aria-label={`Increase quantity of ${product.title}`}
          >
            +
          </button>
          <span className={styles.quantity} aria-label={`Quantity: ${product.quantity}`}>
            {product.quantity}
          </span>
          <button
            onClick={() => removeFromCart()}
            className={styles.action}
            aria-label={`Decrease quantity of ${product.title}`}
          >
            −
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartProduct
