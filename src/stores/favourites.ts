import { IProduct } from '@/models/common/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  products: IProduct[]
}

const initialState: IState = {
  products: [],
}

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addToFavourites(state, action: PayloadAction<IProduct>) {
      const existingProduct = state.products.find(
        (product) => product.id === action.payload.id,
      )

      if (!existingProduct) {
        state.products.push(action.payload)
      }
    },
    removeFromFavourites(state, action: PayloadAction<IProduct>) {
      state.products = state.products.filter(
        (product) => product.id !== action.payload.id,
      )
    },
    clearFavourites(state) {
      state.products = []
    },
    setFavourites(state, action: PayloadAction<IProduct[]>) {
      state.products = action.payload
    },
  },
})

export const {
  addToFavourites,
  removeFromFavourites,
  clearFavourites,
  setFavourites,
} = favouritesSlice.actions
export default favouritesSlice.reducer

