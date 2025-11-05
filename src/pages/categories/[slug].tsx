import { IProduct } from '@/models/common/types'
import { requestCategories } from '@/requests/requestCategories'
import { GetServerSideProps } from 'next'
import ProductList from '@/components/ProductList'
import { requestProducts } from '@/requests/requestProducts'

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
  const { params } = ctx
  const { slug } = params as { slug: string }

  const categories = await requestCategories.fetchAllCategories()

  const currentCategory = categories.find((category) => category.slug === slug)

  if (!currentCategory) {
    return {
      notFound: true,
    }
  }

  const products = await requestProducts.fetchProductsByCategory(
    currentCategory.id,
  )

  return {
    props: {
      categories,
      params: slug,
      products,
    },
  }
}

export default Category
