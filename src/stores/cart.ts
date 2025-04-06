import { IProduct } from "@/models/common/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IProductWithQuantity extends IProduct {
  quantity: number;
}

interface IState {
  products: IProductWithQuantity[];
  total: number;
}

const initialState: IState = {
  products: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<IProduct>) {
      const product = state.products.find(
        (product) => product.id === action.payload.id
      );
      state.total++;
      if (product) {
        product.quantity++;
      } else {
        state.products.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },
  },
});

export const { addProduct } = cartSlice.actions;
export default cartSlice.reducer;
