import { ICategory } from '@/models/common/types'
import { GetServerSideProps } from 'next'
import { CategoryService } from '@/services'
import { HomePage } from '@/features/home'

interface IProps {
  categories: ICategory[]
}

const Home = ({ categories }: IProps) => {
  return <HomePage categories={categories} />
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

export default Home
