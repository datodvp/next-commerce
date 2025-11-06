import { IProduct } from '@/models/common/types'
import { IProductWithQuantity } from '@/stores/cart'

const CART_STORAGE_KEY = 'next-commerce-cart'
const FAVOURITES_STORAGE_KEY = 'next-commerce-favourites'

export interface ICartStorage {
  products: IProductWithQuantity[]
  totalProducts: number
  totalPrice: number
}

// Cart localStorage functions
export const loadCartFromStorage = (): ICartStorage | null => {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    return null
  }
}

export const saveCartToStorage = (cart: ICartStorage): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export const clearCartFromStorage = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_STORAGE_KEY)
}

// Favourites localStorage functions
export const loadFavouritesFromStorage = (): IProduct[] | null => {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error loading favourites from localStorage:', error)
    return null
  }
}

export const saveFavouritesToStorage = (favourites: IProduct[]): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites))
  } catch (error) {
    console.error('Error saving favourites to localStorage:', error)
  }
}

export const clearFavouritesFromStorage = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(FAVOURITES_STORAGE_KEY)
}

