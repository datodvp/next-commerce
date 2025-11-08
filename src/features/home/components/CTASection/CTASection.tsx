import Link from 'next/link'
import styles from './CTASection.module.scss'

interface CTASectionProps {
  show?: boolean
}

const CTASection = ({ show = true }: CTASectionProps) => {
  if (!show) return null

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>Ready to Upgrade Your Kitchen?</h2>
        <p className={styles.ctaDescription}>
          Browse our complete collection and discover the perfect tools for your
          culinary adventures.
        </p>
        <Link href="/products" className={styles.ctaButton}>
          Start Shopping
        </Link>
      </div>
    </section>
  )
}

export default CTASection

