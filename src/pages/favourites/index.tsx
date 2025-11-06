import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import styles from './styles.module.scss'
import { CategoryService } from '@/services'
import { useAppDispatch, useAppSelector } from '@/stores'
import { GetServerSideProps } from 'next'
import { clearFavourites } from '@/stores/favourites'
import { useState } from 'react'
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal'
import { IProduct } from '@/models/common/types'

const Favourites = () => {
  const favouritesStore = useAppSelector((state) => state.favourites)
  const products = favouritesStore.products
  const dispatch = useAppDispatch()
  const [showClearModal, setShowClearModal] = useState(false)

  const handleClearFavourites = () => {
    setShowClearModal(true)
  }

  const confirmClear = () => {
    dispatch(clearFavourites())
    setShowClearModal(false)
  }

  if (products.length === 0) {
    return (
      <section className={styles.root}>
        <div className={styles.empty}>
          <div className={styles.icon}>❤️</div>
          <h1 className={styles.title}>Your Favourites is Empty</h1>
          <p className={styles.message}>
            Looks like you haven&apos;t added anything to your favourites yet.
          </p>
          <Link href="/" className={styles.link}>
            Start Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className={styles.root}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            My Favourites ({products.length})
          </h1>
          <button
            onClick={handleClearFavourites}
            className={styles.clearButton}
            aria-label="Clear all favourites"
          >
            Clear All Favourites
          </button>
        </div>
        <div className={styles.products}>
          {products.map((product: IProduct) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        <div className={styles.footer}>
          <Link href="/" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      </section>
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClear}
        title="Clear All Favourites?"
        message="Are you sure you want to remove all products from your favourites?"
        confirmText="Clear All"
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

export default Favourites

