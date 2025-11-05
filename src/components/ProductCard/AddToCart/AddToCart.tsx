import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './AddToCart.module.scss'
import {
  faBasketShopping,
  faSpinner,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons'
import { IProduct } from '@/models/common/types'
import { useState } from 'react'
import { useAppDispatch } from '@/stores'
import { addProduct } from '@/stores/cart'
import { useProductInBasket } from '@/hooks/useProductInBasket'

interface IProps {
  product: IProduct
}

const AddToCart = ({ product }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isInCart = useProductInBasket(product)

  const dispatch = useAppDispatch()

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event from bubbling to parent Link
    setIsLoading(true)
    setTimeout(() => {
      dispatch(addProduct(product))
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className={styles.root}>
      <button
        disabled={isInCart}
        onClick={addToCart}
        className={styles.addToCart}
        aria-label={
          isInCart
            ? `${product.title} is already in cart`
            : `Add ${product.title} to cart`
        }
        title={isInCart ? 'Already in cart' : 'Add to cart'}
      >
        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            width={16}
            height={16}
            spin
            className={styles.spinner}
          />
        ) : (
          <FontAwesomeIcon
            icon={isInCart ? faCircleCheck : faBasketShopping}
            width={16}
            height={16}
          />
        )}
      </button>
    </div>
  )
}

export default AddToCart
