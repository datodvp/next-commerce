import { ICategory, IProduct } from '@/models/common/types'
import { GetServerSideProps } from 'next'
import { CategoryService, ProductService } from '@/services'
import ProductList from '@/components/ProductList'

interface IProps {
  categories: ICategory[]
  products: IProduct[]
}

const Home = ({ products }: IProps) => {
  return (
    <section>
      <ProductList products={products} />
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [categories, products] = await Promise.all([
      CategoryService.getAll(),
      ProductService.getAll(),
    ])

    return {
      props: {
        categories,
        products,
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        categories: [],
        products: [],
      },
    }
  }
}

export default Home
