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
      <Image
        src={product.images[0].url}
        alt={product.title}
        width={150}
        height={150}
      />
      <div className={styles.info}>
        <span className={styles.title}>{product.title}</span>
        <span className={styles.price}>$ {product.price}</span>
        <div className={styles.addition}>
          <button onClick={() => addToCart()} className={styles.action}>
            +
          </button>
          <span className={styles.quantity}>{product.quantity}</span>
          <button onClick={() => removeFromCart()} className={styles.action}>
            -
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartProduct
