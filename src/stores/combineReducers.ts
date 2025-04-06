import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "@/stores/cart";

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;
