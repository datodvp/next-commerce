import React from 'react'
import Link from 'next/link'
import styles from './CartSummary.module.scss'

interface CartSummaryProps {
  totalProducts: number
  totalPrice: number
  onCheckout?: () => void
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalProducts,
  totalPrice,
  onCheckout,
}) => {
  const subtotal = totalPrice
  const tax = subtotal * 0.1 // 10% tax (example)
  const total = subtotal + tax

  return (
    <div className={styles.summary}>
      <div className={styles.summaryRow}>
        <span className={styles.label}>Subtotal ({totalProducts} items)</span>
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
        onClick={
          onCheckout || (() => alert('Checkout functionality coming soon!'))
        }
      >
        Proceed to Checkout
      </button>
      <Link href="/products" className={styles.continueShopping}>
        Continue Shopping
      </Link>
    </div>
  )
}

export default CartSummary
