import React from 'react'
import { IProduct } from '@/models/common/types'
import Breadcrumb from '@/components/Breadcrumb'
import { createProductBreadcrumbs } from '@/utils/breadcrumbUtils'
import ProductImages from '../ProductImages'
import ProductInfo from '../ProductInfo'
import styles from './ProductDetail.module.scss'

interface ProductDetailProps {
  product: IProduct
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const breadcrumbs = createProductBreadcrumbs(
    product.title,
    product.category?.slug,
    product.category?.name,
  )

  return (
    <main className={styles.root}>
      <Breadcrumb items={breadcrumbs} />

      <section className={styles.productDetails}>
        <ProductImages
          images={product.images || []}
          alt={product.title}
        />
        <ProductInfo product={product} />
      </section>
    </main>
  )
}

export default ProductDetail

