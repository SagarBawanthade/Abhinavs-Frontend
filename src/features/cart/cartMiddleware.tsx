import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { cartMiddleware } from "./cartSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware),
});

export default store;





