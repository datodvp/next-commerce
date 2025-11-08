import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import { useAppDispatch, useAppSelector } from '@/stores'
import { clearFavourites } from '@/stores/favourites'
import { IProduct } from '@/models/common/types'
import { useClearConfirmation } from '@/shared/hooks'
import { PageHeader, ConfirmationModalWrapper } from '@/shared/components'
import styles from './FavouritesPage.module.scss'

const FavouritesPage = () => {
  const favouritesStore = useAppSelector((state) => state.favourites)
  const products = favouritesStore.products
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
    onConfirm: () => dispatch(clearFavourites()),
    title: 'Clear All Favourites?',
    message: 'Are you sure you want to remove all products from your favourites?',
    confirmText: 'Clear All',
    cancelText: 'Cancel',
  })

  if (products.length === 0) {
    return (
      <section className={styles.root}>
        <EmptyState
          icon="❤️"
          title="Your Favourites is Empty"
          message="Looks like you haven't added anything to your favourites yet."
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
          title={`My Favourites (${products.length})`}
          action={{
            label: 'Clear All Favourites',
            onClick: handleClear,
            ariaLabel: 'Clear all favourites',
          }}
        />
        <div className={styles.products}>
          {products.map((product: IProduct) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        <div className={styles.footer}>
          <Link href="/products" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
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

export default FavouritesPage

