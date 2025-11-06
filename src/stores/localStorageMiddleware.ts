import {
  saveCartToStorage,
  saveFavouritesToStorage,
} from '@/utils/localStorage'
import { RootState } from '@/stores'
import { setCart } from './cart'
import { setFavourites } from './favourites'
import type { Middleware } from '@reduxjs/toolkit'

export const localStorageMiddleware: Middleware<
  object,
  RootState
> = (store) => (next) => (action) => {
    const result = next(action)
    const state = store.getState()

    // Type guard to check if action has a type property
    if (
      typeof action === 'object' &&
      action !== null &&
      'type' in action &&
      (action.type === setCart.type || action.type === setFavourites.type)
    ) {
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

