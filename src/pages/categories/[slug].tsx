import { IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import ProductList from '@/components/ProductList'

interface IProps {
  products: IProduct[]
}

const Category = ({ products }: IProps) => {
  return (
    <section>
      <ProductList products={products} />
    </section>
  )
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
