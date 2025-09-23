import { GetServerSideProps } from 'next'
import { requestProducts } from '@/requests/requestProducts'
import { IProduct } from '@/models/common/types'
import Image from 'next/image'

interface IProps {
  product: IProduct
}

const Product = ({ product }: IProps) => {
  return (
    <section>
      <div>{product.title}</div>
      <div>{product.price}</div>
      <div>{product.category.name}</div>
      <div>{product.description}</div>
      {product.images.map((image) => (
        <Image
          width={300}
          height={300}
          key={image}
          src={image}
          alt={product.title}
        />
      ))}
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }
  console.log(slug)
  const product = await requestProducts.fetchProductBySlug(slug)
  console.log('product', product)
  return {
    props: {
      product,
    },
  }
}

export default Product
