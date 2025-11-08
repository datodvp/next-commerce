import Link from 'next/link'
import Image from 'next/image'
import { ICategory } from '@/models/common/types'
import styles from './CategoriesSection.module.scss'

interface CategoriesSectionProps {
  categories: ICategory[]
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  const getCategoryImage = (index: number, categoryImage?: string) => {
    // Use specific images for first few categories
    if (index === 0) return '/images/green-juice.png'
    if (index === 1) return '/images/global-knives.png'
    if (index === 2) return '/images/cooking.png'
    return categoryImage
  }

  if (categories.length === 0) {
    return (
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <p className={styles.sectionSubtitle}>
            Explore our carefully curated collections
          </p>
        </div>
        <div className={styles.noCategories}>
          <p>No categories available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <p className={styles.sectionSubtitle}>
          Explore our carefully curated collections
        </p>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => {
          const imageSrc = getCategoryImage(index, category.image)

          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={styles.categoryCard}
            >
              <div className={styles.categoryImage}>
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={category.name}
                    fill
                    className={styles.categoryImg}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className={styles.categoryPlaceholder}>
                    <span className={styles.categoryIcon}>🏪</span>
                  </div>
                )}
              </div>
              <div className={styles.categoryContent}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <span className={styles.categoryArrow}>→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategoriesSection

