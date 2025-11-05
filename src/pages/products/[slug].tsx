import { GetServerSideProps } from 'next'
import { CategoryService, ProductService } from '@/services'
import { IProduct } from '@/models/common/types'
import Image from 'next/image'
import styles from './styles.module.scss'
import { useState } from 'react'
import AddToCartDetail from '@/components/ProductCard/AddToCartDetail'

interface IProps {
  product: IProduct
}

const Product = ({ product }: IProps) => {
  const [currentPreviewImage, setCurrentPreviewImage] = useState<string>(
    product.images?.[0]?.url || '',
  )

  const updatePreviewImage = (image: string) => {
    setCurrentPreviewImage(image)
  }
  return (
    <main className={styles.root}>
      <section className={styles.productDetails}>
        <div>
          {product.images && product.images.length > 0 ? (
            <>
              <div className={styles.previewContainer}>
                {product.images.map((image) => (
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
                ))}
              </div>
              <div className={styles.smallerImagesContainer}>
                {product.images.map((image) => (
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
                ))}
              </div>
            </>
          ) : (
            <div className={styles.previewContainer}>
              <div className={styles.noImage}>No image available</div>
            </div>
          )}
        </div>
        <div>
          <h1 className={styles.title}>{product.title}</h1>
          {product.category && (
            <h2 className={styles.category}>{product.category.name}</h2>
          )}

          <div className={styles.priceContainer}>
            <span className={styles.dollarSymbol}>$</span>
            <span>{product.price.toFixed(2)}</span>
          </div>

          {product.description && (
            <div className={styles.description}>
              <span className={styles.label}>Description</span>
              <p>{product.description}</p>
            </div>
          )}

          <AddToCartDetail product={product} />
        </div>
      </section>
    </main>
  )
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
