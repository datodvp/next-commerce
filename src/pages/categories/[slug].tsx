import { ICategory, IProduct } from '@/models/common/types'
import { CategoryService, ProductService } from '@/services'
import { GetServerSideProps } from 'next'
import ProductList from '@/components/ProductList'
import styles from './styles.module.scss'

interface IProps {
  category: ICategory
  products: IProduct[]
}

const Category = ({ category, products }: IProps) => {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.subtitle}>
          {products.length > 0
            ? `${products.length} product${products.length !== 1 ? 's' : ''} available`
            : 'No products in this category'}
        </p>
      </div>
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
