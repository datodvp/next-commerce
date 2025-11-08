import { IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import ProductsPage from '@/features/products/components/ProductsPage'

interface IProps {
  products: IProduct[]
}

const Products = ({ products }: IProps) => {
  return <ProductsPage products={products} />
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
    console.error('Error fetching products:', error)
    return {
      props: {
        categories: [],
        products: [],
      },
    }
  }
}

export default Products
