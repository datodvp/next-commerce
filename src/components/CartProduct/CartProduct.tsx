import React, { useState } from 'react'
import { addProduct, IProductWithQuantity, removeProduct } from '@/stores/cart'
import Image from 'next/image'
import styles from './CartProduct.module.scss'
import { useAppDispatch } from '@/stores'
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal'

interface IProps {
  product: IProductWithQuantity
}

const CartProduct = ({ product }: IProps): React.ReactElement => {
  const dispatch = useAppDispatch()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const addToCart = () => {
    dispatch(addProduct(product))
  }

  const handleRemoveFromCart = () => {
    if (product.quantity === 1) {
      setShowConfirmModal(true)
    } else {
      dispatch(removeProduct(product))
    }
  }

  const confirmRemove = () => {
    dispatch(removeProduct(product))
  }

  return (
    <>
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
              onClick={handleRemoveFromCart}
              className={styles.action}
              aria-label={`Decrease quantity of ${product.title}`}
            >
              −
            </button>
            <span className={styles.quantity} aria-label={`Quantity: ${product.quantity}`}>
              {product.quantity}
            </span>
            <button
              onClick={() => addToCart()}
              className={styles.action}
              aria-label={`Increase quantity of ${product.title}`}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmRemove}
        title="Remove Product?"
        message={`Are you sure you want to remove "${product.title}" from your cart?`}
        confirmText="Remove"
        cancelText="Keep It"
      />
    </>
  )
}

export default CartProduct
