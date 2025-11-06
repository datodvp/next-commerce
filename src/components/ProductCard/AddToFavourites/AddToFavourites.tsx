import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './AddToFavourites.module.scss'
import {
  faHeart,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { IProduct } from '@/models/common/types'
import { useState } from 'react'
import { useAppDispatch } from '@/stores'
import {
  addToFavourites,
  removeFromFavourites,
} from '@/stores/favourites'
import { useProductInFavourites } from '@/hooks/useProductInFavourites'

interface IProps {
  product: IProduct
}

const AddToFavourites = ({ product }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isInFavourites = useProductInFavourites(product)

  const dispatch = useAppDispatch()

  const toggleFavourites = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event from bubbling to parent Link
    setIsLoading(true)
    setTimeout(() => {
      if (isInFavourites) {
        dispatch(removeFromFavourites(product))
      } else {
        dispatch(addToFavourites(product))
      }
      setIsLoading(false)
    }, 300)
  }

  return (
    <div className={styles.root}>
      <button
        onClick={toggleFavourites}
        className={`${styles.addToFavourites} ${isInFavourites ? styles.filled : ''}`}
        aria-label={
          isInFavourites
            ? `Remove ${product.title} from favourites`
            : `Add ${product.title} to favourites`
        }
        title={isInFavourites ? 'Remove from favourites' : 'Add to favourites'}
      >
        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            width={16}
            height={16}
            spin
            className={styles.spinner}
          />
        ) : (
          <FontAwesomeIcon
            icon={faHeart}
            width={16}
            height={16}
          />
        )}
      </button>
    </div>
  )
}

export default AddToFavourites

