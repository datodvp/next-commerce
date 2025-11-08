import CartProduct from '@/components/CartProduct'
import EmptyState from '@/components/EmptyState'
import { useAppDispatch, useAppSelector } from '@/stores'
import { clearCart, IProductWithQuantity } from '@/stores/cart'
import { useClearConfirmation } from '@/shared/hooks'
import { PageHeader, ConfirmationModalWrapper } from '@/shared/components'
import CartSummary from '../CartSummary'
import styles from './CartPage.module.scss'

const CartPage = () => {
  const cartStore = useAppSelector((state) => state.cart)
  const products = cartStore.products
  const dispatch = useAppDispatch()

  const {
    isOpen,
    handleClear,
    closeModal,
    handleConfirm,
    title,
    message,
    confirmText,
    cancelText,
  } = useClearConfirmation({
    onConfirm: () => dispatch(clearCart()),
    title: 'Clear Cart?',
    message: 'Are you sure you want to remove all items from your cart?',
    confirmText: 'Clear Cart',
    cancelText: 'Cancel',
  })

  if (products.length === 0) {
    return (
      <section className={styles.root}>
        <EmptyState
          icon="🛒"
          title="Your Cart is Empty"
          message="Looks like you haven't added anything to your cart yet."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </section>
    )
  }

  return (
    <>
      <section className={styles.root}>
        <PageHeader
          title="Shopping Cart"
          action={{
            label: 'Clear Cart',
            onClick: handleClear,
            ariaLabel: 'Clear all items from cart',
          }}
        />
        <div className={styles.products}>
          {products.map((product: IProductWithQuantity) => (
            <CartProduct product={product} key={product.id} />
          ))}
        </div>
        <CartSummary
          totalProducts={cartStore.totalProducts}
          totalPrice={cartStore.totalPrice}
        />
      </section>
      <ConfirmationModalWrapper
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
      />
    </>
  )
}

export default CartPage

