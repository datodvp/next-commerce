import { IProduct } from '@/models/common/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IProductWithQuantity extends IProduct {
  quantity: number
}

interface IState {
  products: IProductWithQuantity[]
  totalProducts: number
  totalPrice: number
}

const initialState: IState = {
  products: [],
  totalProducts: 0,
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<IProduct>) {
      const existingProduct = state.products.find(
        (product) => product.id === action.payload.id,
      )

      if (existingProduct) {
        existingProduct.quantity++
      } else {
        state.products.push({
          ...action.payload,
          quantity: 1,
        })
      }

      state.totalProducts++
      state.totalPrice = Math.max(0, state.totalPrice + action.payload.price)
    },
    removeProduct(state, action: PayloadAction<IProduct>) {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.id,
      )

      if (productIndex === -1) return

      const product = state.products[productIndex]

      if (product.quantity > 1) {
        product.quantity--
      } else {
        state.products.splice(productIndex, 1)
      }

      state.totalProducts = Math.max(0, state.totalProducts - 1)
      state.totalPrice = Math.max(0, state.totalPrice - product.price)
    },
    clearCart(state) {
      state.products = []
      state.totalProducts = 0
      state.totalPrice = 0
    },
    setCart(state, action: PayloadAction<IState>) {
      state.products = action.payload.products
      state.totalProducts = action.payload.totalProducts
      state.totalPrice = action.payload.totalPrice
    },
  },
})

export const { addProduct, removeProduct, clearCart, setCart } = cartSlice.actions
export default cartSlice.reducer
