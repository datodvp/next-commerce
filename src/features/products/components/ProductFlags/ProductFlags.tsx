import React from 'react'
import { IFlag } from '@/models/common/types'
import styles from './ProductFlags.module.scss'

interface ProductFlagsProps {
  flags: IFlag[]
}

const ProductFlags: React.FC<ProductFlagsProps> = ({ flags }) => {
  if (!flags || flags.length === 0) {
    return null
  }

  return (
    <div className={styles.flags}>
      {flags.map((flag) => (
        <span key={flag.id} className={styles.flagBadge}>
          {flag.name}
        </span>
      ))}
    </div>
  )
}

export default ProductFlags
