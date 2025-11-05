import CartProduct from '@/components/CartProduct'
import styles from './styles.module.scss'
import { CategoryService } from '@/services'
import { useAppSelector } from '@/stores'
import { GetServerSideProps } from 'next'

const Cart = () => {
  const cartStore = useAppSelector((state) => state.cart)

  const products = cartStore.products

  if (products.length === 0) {
    return (
      <section className={styles.root}>
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.root}>
      <div className={styles.products}>
        {products.map((product) => (
          <CartProduct product={product} key={product.id} />
        ))}
      </div>
      <div className={styles.sum}>
        Total Price: <b> ${cartStore.totalPrice.toFixed(2)}</b>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categories = await CategoryService.getAll()

    return {
      props: {
        categories,
      },
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      props: {
        categories: [],
      },
    }
  }
}

export default Cart
