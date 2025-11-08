import Link from 'next/link'
import { BreadcrumbItem } from '@/utils/breadcrumbUtils'
import styles from './Breadcrumb.module.scss'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={index} className={styles.item}>
            {item.href && !isLast ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
            {!isLast && <span className={styles.separator}>/</span>}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb

