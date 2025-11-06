import { Middleware } from '@reduxjs/toolkit'
import {
  saveCartToStorage,
  saveFavouritesToStorage,
} from '@/utils/localStorage'
import { RootState } from '@/stores'
import { setCart } from './cart'
import { setFavourites } from './favourites'

export const localStorageMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action)
    const state = store.getState()

    // Don't save to localStorage when loading from localStorage (to prevent overwriting)
    if (action.type === setCart.type || action.type === setFavourites.type) {
      return result
    }

    // Save cart to localStorage
    saveCartToStorage({
      products: state.cart.products,
      totalProducts: state.cart.totalProducts,
      totalPrice: state.cart.totalPrice,
    })

    // Save favourites to localStorage
    saveFavouritesToStorage(state.favourites.products)

    return result
  }

