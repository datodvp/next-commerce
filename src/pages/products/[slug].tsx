import { GetServerSideProps } from 'next'
import { requestProducts } from '@/requests/requestProducts'
import { ICategory, IProduct } from '@/models/common/types'
import Image from 'next/image'
import { requestCategories } from '@/requests/requestCategories'
import styles from './styles.module.scss'
import { useState } from 'react'

interface IProps {
  product: IProduct
}

const Product = ({ product }: IProps) => {
  const [currentPreviewImage, setCurrentPreviewImage] = useState<string>(
    product.images[0].url,
  )

  const updatePreviewImage = (image: string) => {
    setCurrentPreviewImage(image)
  }
  return (
    <main className={styles.root}>
      <section className={styles.productDetails}>
        <div>
          <div className={styles.previewContainer}>
            {product.images.map((image) => {
              return (
                <Image
                  src={image.url}
                  alt={product.title}
                  width={700}
                  height={700}
                  className={styles.image}
                  priority
                  key={image.id}
                  style={{
                    display:
                      currentPreviewImage === image.url ? 'block' : 'none',
                  }}
                />
              )
            })}
          </div>
          <div className={styles.smallerImagesContainer}>
            {product.images.map((image) => {
              return (
                <Image
                  src={image.url}
                  alt={product.title}
                  width={150}
                  height={150}
                  key={image.id}
                  priority
                  className={`${styles.smallerImage} ${image.url !== currentPreviewImage && styles.blurredImage}`}
                  onMouseEnter={() => updatePreviewImage(image.url)}
                />
              )
            })}
          </div>
        </div>
        <div>
          <h1 className={styles.title}>{product.title}</h1>
          {/* <h3 className={styles.category}>{product.category.name}</h3> */}

          <div className={styles.priceContainer}>
            <span className={styles.dollarSymbol}>$</span>
            <span>123.5</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const categories: ICategory[] | null =
    await requestCategories.fetchAllCategories()

  const { slug } = context.params as { slug: string }

  const product = await requestProducts.fetchProductBySlug(slug)
  console.log('product', product)
  return {
    props: {
      categories,
      product,
    },
  }
}

export default Product
