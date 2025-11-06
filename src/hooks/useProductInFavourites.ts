import { IProduct } from '@/models/common/types'
import { useAppSelector } from '@/stores'

export const useProductInFavourites = (product: IProduct) => {
  const favouritesStore = useAppSelector((state) => state.favourites)

  const productIsInFavourites = favouritesStore.products.some(
    (item) => item.id === product.id,
  )

  return productIsInFavourites
}

