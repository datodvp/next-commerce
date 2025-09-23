import { IProduct } from '@/models/common/types'
import { useAppSelector } from '@/stores'

export const useProductInBasket = (product: IProduct) => {
  const cartStore = useAppSelector((state) => state.cart)

  const productIsInCart = cartStore.products.some(
    (item) => item.id === product.id,
  )

  return productIsInCart
}
