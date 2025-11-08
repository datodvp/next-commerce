import { ICategory } from '@/models/common/types'
import { GetServerSideProps } from 'next'
import { CategoryService } from '@/services'
import Link from 'next/link'
import Image from 'next/image'
import styles from './styles.module.scss'

interface IProps {
  categories: ICategory[]
}

const Home = ({ categories }: IProps) => {
  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to{' '}
            <span className={styles.brandName}>Kitchen Essentials</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your one-stop destination for premium kitchen products that
            transform your cooking experience
          </p>
          <p className={styles.heroDescription}>
            At Kitchen Essentials, we believe that great meals start with great
            tools. For over a decade, we&apos;ve been curating the finest
            selection of kitchenware, cookware, and culinary accessories. Our
            passion for quality and commitment to excellence has made us a
            trusted name in kitchens across the country.
          </p>
          <div className={styles.heroFeatures}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✨</span>
              <span>Premium Quality</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🚚</span>
              <span>Fast Delivery</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💚</span>
              <span>Eco-Friendly</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/hero-image.png"
              alt="Kitchen Essentials"
              fill
              className={styles.heroImg}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <p className={styles.sectionSubtitle}>
            Explore our carefully curated collections
          </p>
        </div>

        {categories.length > 0 ? (
          <div className={styles.categoriesGrid}>
            {categories.map((category, index) => {
              // Use specific images for first and second categories
              let imageSrc = category.image
              if (index === 0) {
                imageSrc = '/images/green-juice.png'
              } else if (index === 1) {
                imageSrc = '/images/global-knives.png'
              } else if (index === 2) {
                imageSrc = '/images/cooking.png'
              }

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
        ) : (
          <div className={styles.noCategories}>
            <p>No categories available at the moment.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {categories.length > 0 && (
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Upgrade Your Kitchen?</h2>
            <p className={styles.ctaDescription}>
              Browse our complete collection and discover the perfect tools for
              your culinary adventures.
            </p>
            <Link
              href="/products"
              className={styles.ctaButton}
            >
              Start Shopping
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categories = await CategoryService.getAll()

    return {
      props: {
        categories,
      },
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      props: {
        categories: [],
      },
    }
  }
}

export default Home
