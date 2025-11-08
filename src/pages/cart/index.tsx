import { CategoryService } from '@/services'
import { GetServerSideProps } from 'next'
import CartPage from '@/features/cart/components/CartPage'

const Cart = () => {
  return <CartPage />
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
