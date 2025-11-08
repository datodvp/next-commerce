import { CategoryService } from '@/services'
import { GetServerSideProps } from 'next'
import FavouritesPage from '@/features/favourites/components/FavouritesPage'

const Favourites = () => {
  return <FavouritesPage />
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

