import Link from 'next/link'
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
          <div className={styles.icon}>🛒</div>
          <h1 className={styles.title}>Your Cart is Empty</h1>
          <p className={styles.message}>
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/" className={styles.link}>
            Start Shopping
          </Link>
        </div>
      </section>
    )
  }

  const subtotal = cartStore.totalPrice
  const tax = subtotal * 0.1 // 10% tax (example)
  const total = subtotal + tax

  return (
    <section className={styles.root}>
      <h1 className={styles.pageTitle}>Shopping Cart</h1>
      <div className={styles.products}>
        {products.map((product) => (
          <CartProduct product={product} key={product.id} />
        ))}
      </div>
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Subtotal ({cartStore.totalProducts} items)</span>
          <span className={styles.value}>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Tax</span>
          <span className={styles.value}>${tax.toFixed(2)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span className={styles.label}>Total</span>
          <span className={styles.value}>${total.toFixed(2)}</span>
        </div>
        <button
          className={styles.checkoutButton}
          aria-label="Proceed to checkout"
          onClick={() => alert('Checkout functionality coming soon!')}
        >
          Proceed to Checkout
        </button>
        <Link href="/" className={styles.continueShopping}>
          Continue Shopping
        </Link>
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
