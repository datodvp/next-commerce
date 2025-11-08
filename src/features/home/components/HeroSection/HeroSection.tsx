import Image from 'next/image'
import styles from './HeroSection.module.scss'

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Welcome to{' '}
          <span className={styles.brandName}>Kitchen Essentials</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Your one-stop destination for premium kitchen products that transform
          your cooking experience
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
  )
}

export default HeroSection

