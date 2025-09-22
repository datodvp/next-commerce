import { ICategory, IProduct } from '@/models/common/types'
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

  const categories: ICategory[] = await requestCategories.fetchAllCategories()

  const currentCategory = categories.find((category) => category.slug === slug)!

  const products: IProduct[] = await requestProducts.fetchProductsByCategory(
    currentCategory.id,
  )

  return {
    props: {
      categories: categories,
      params: slug,
      products: products,
    },
  }
}

export default Category
