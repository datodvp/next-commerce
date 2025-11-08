import { ICategory, IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import CategoryPage from '@/features/categories/components/CategoryPage'

interface IProps {
  category: ICategory
  products: IProduct[]
}

const Category = ({ category, products }: IProps) => {
  return <CategoryPage category={category} products={products} />
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { params } = ctx
    const { slug } = params as { slug: string }

    const categories = await CategoryService.getAll()

    const currentCategory = categories.find((category) => category.slug === slug)

    if (!currentCategory) {
      return {
        notFound: true,
      }
    }

    const products = await ProductService.getByCategory(currentCategory.id)

    return {
      props: {
        categories,
        category: currentCategory,
        products,
      },
    }
  } catch (error) {
    console.error('Error fetching category data:', error)
    return {
      notFound: true,
    }
  }
}

export default Category
