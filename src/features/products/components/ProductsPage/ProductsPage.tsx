import { IProduct } from '@/models/common/types'
import Breadcrumb from '@/components/Breadcrumb'
import ProductList from '@/components/ProductList'
import { BreadcrumbItem } from '@/utils/breadcrumbUtils'
import styles from './ProductsPage.module.scss'

interface ProductsPageProps {
  products: IProduct[]
}

const ProductsPage = ({ products }: ProductsPageProps) => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products' },
  ]

  return (
    <section className={styles.root}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.subtitle}>
          {products.length > 0 ? (
            <>
              Discover our complete collection of{' '}
              <strong>{products.length}</strong>{' '}
              {products.length === 1 ? 'product' : 'products'}
            </>
          ) : (
            'No products available at the moment'
          )}
        </p>
      </div>

      <ProductList products={products} />
    </section>
  )
}

export default ProductsPage

