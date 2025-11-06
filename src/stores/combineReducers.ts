import { combineReducers } from '@reduxjs/toolkit'
import cartReducer from '@/stores/cart'
import favouritesReducer from '@/stores/favourites'

const rootReducer = combineReducers({
  cart: cartReducer,
  favourites: favouritesReducer,
})

export default rootReducer
