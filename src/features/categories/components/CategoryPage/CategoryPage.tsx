import { ICategory, IProduct } from '@/models/common/types'
import Breadcrumb from '@/components/Breadcrumb'
import ProductList from '@/components/ProductList'
import { createCategoryBreadcrumbs } from '@/utils/breadcrumbUtils'
import styles from './CategoryPage.module.scss'

interface CategoryPageProps {
  category: ICategory
  products: IProduct[]
}

const CategoryPage = ({ category, products }: CategoryPageProps) => {
  const breadcrumbs = createCategoryBreadcrumbs(category.name)

  return (
    <section className={styles.root}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.header}>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.subtitle}>
          {products.length > 0 ? (
            <>
              Discover our collection of <strong>{products.length}</strong>{' '}
              {products.length === 1 ? 'product' : 'products'} in this category
            </>
          ) : (
            'No products available in this category at the moment'
          )}
        </p>
      </div>

      <ProductList products={products} />
    </section>
  )
}

export default CategoryPage

