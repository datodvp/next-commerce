import { IProduct } from '@/models/common/types'
import { useAppSelector } from '@/stores'
import { IProductWithQuantity } from '@/stores/cart'

export const useProductInBasket = (product: IProduct) => {
  const cartStore = useAppSelector((state) => state.cart)

  const productIsInCart = cartStore.products.some(
    (item: IProductWithQuantity) => item.id === product.id,
  )

  return productIsInCart
}
