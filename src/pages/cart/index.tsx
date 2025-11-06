import Link from 'next/link'
import CartProduct from '@/components/CartProduct'
import styles from './styles.module.scss'
import { CategoryService } from '@/services'
import { useAppDispatch, useAppSelector } from '@/stores'
import { GetServerSideProps } from 'next'
import { clearCart, IProductWithQuantity } from '@/stores/cart'
import { useState } from 'react'
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal'

const Cart = () => {
  const cartStore = useAppSelector((state) => state.cart)
  const products = cartStore.products
  const dispatch = useAppDispatch()
  const [showClearModal, setShowClearModal] = useState(false)

  const handleClearCart = () => {
    setShowClearModal(true)
  }

  const confirmClear = () => {
    dispatch(clearCart())
    setShowClearModal(false)
  }

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
    <>
      <section className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className={styles.clearButton}
            aria-label="Clear all items from cart"
          >
            Clear Cart
          </button>
        </div>
        <div className={styles.products}>
        {products.map((product: IProductWithQuantity) => (
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
    <ConfirmationModal
      isOpen={showClearModal}
      onClose={() => setShowClearModal(false)}
      onConfirm={confirmClear}
      title="Clear Cart?"
      message="Are you sure you want to remove all items from your cart?"
      confirmText="Clear Cart"
      cancelText="Cancel"
    />
    </>
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
