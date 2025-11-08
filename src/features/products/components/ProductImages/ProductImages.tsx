import React from 'react'
import ImageGallery from '@/components/ImageGallery'
import styles from './ProductImages.module.scss'

interface ProductImagesProps {
  images: Array<{ url: string; id?: number | string }>
  alt: string
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, alt }) => {
  return (
    <div className={styles.imageSection}>
      <ImageGallery images={images} alt={alt} />
    </div>
  )
}

export default ProductImages
