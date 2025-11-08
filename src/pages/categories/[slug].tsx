import { ICategory, IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import ProductList from '@/components/ProductList'
import Link from 'next/link'
import styles from './styles.module.scss'

interface IProps {
  category: ICategory
  products: IProduct[]
}

const Category = ({ category, products }: IProps) => {
  return (
    <section className={styles.root}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className={styles.separator}>/</span>
        <Link href="/products">Products</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{category.name}</span>
      </nav>

      {/* Category Header */}
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

      {/* Product List */}
      <ProductList products={products} />
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { params } = ctx
    const { slug } = params as { slug: string }

    const categories = await CategoryService.getAll()

    const currentCategory = categories.find((category) => category.slug === slug)

    if (!currentCategory) {
      return {
        notFound: true,
      }
    }

    const products = await ProductService.getByCategory(currentCategory.id)

    return {
      props: {
        categories,
        category: currentCategory,
        products,
      },
    }
  } catch (error) {
    console.error('Error fetching category data:', error)
    return {
      notFound: true,
    }
  }
}

export default Category
