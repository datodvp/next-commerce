import { useState } from 'react'
import { useAppDispatch } from '@/stores'
import { addProduct } from '@/stores/cart'
import { useProductInBasket } from '@/hooks/useProductInBasket'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { IProduct } from '@/models/common/types'
import styles from './AddToCartDetail.module.scss'

interface IProps {
  product: IProduct
}

const AddToCartDetail = ({ product }: IProps) => {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const dispatch = useAppDispatch()
  const isInCart = useProductInBasket(product)

  const handleAddToCart = () => {
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      dispatch(addProduct(product))
    }
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className={styles.actions}>
      {!isInCart && (
        <div className={styles.quantitySelector}>
          <button
            className={styles.quantityButton}
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className={styles.quantity} aria-label="Quantity">
            {quantity}
          </span>
          <button
            className={styles.quantityButton}
            onClick={increaseQuantity}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
      <button
        className={styles.addToCartButton}
        onClick={handleAddToCart}
        disabled={isInCart || isAdding}
        aria-label={
          isInCart
            ? 'Product already in cart'
            : `Add ${quantity} ${product.title} to cart`
        }
      >
        {isInCart ? (
          <>
            <FontAwesomeIcon icon={faCheckCircle} />
            In Cart
          </>
        ) : isAdding ? (
          'Adding...'
        ) : (
          <>
            <FontAwesomeIcon icon={faBasketShopping} />
            Add to Cart {quantity > 1 && `(${quantity})`}
          </>
        )}
      </button>
    </div>
  )
}

export default AddToCartDetail

