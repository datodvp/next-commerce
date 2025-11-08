import { GetServerSideProps } from 'next'
import { CategoryService, ProductService } from '@/services'
import { IProduct } from '@/models/common/types'
import ProductDetail from '@/features/products/components/ProductDetail'

interface IProps {
  product: IProduct
}

const Product = ({ product }: IProps) => {
  return <ProductDetail product={product} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { slug } = context.params as { slug: string }

    const [categories, product] = await Promise.all([
      CategoryService.getAll(),
      ProductService.getBySlug(slug),
    ])

    if (!product) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        categories,
        product,
      },
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      notFound: true,
    }
  }
}

export default Product
