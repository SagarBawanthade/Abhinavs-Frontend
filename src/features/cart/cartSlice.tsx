import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the ProductInCart type
export type ProductInCart = {
  id: string;
  _id: string; // Add this line
  size: string;
  color: string;
  quantity: number;
  images: string;
  name: string;
  price: number;
  stock: number;



  
};

type CartState = {
  productsInCart: ProductInCart[];
  subtotal: number;
  userId: string;
};

const API_URL = "https://abhinasv-s-backend.onrender.com/api/cart/cart";

// Fetch cart from the backend API
const fetchCartFromAPI = async (userId: string): Promise<CartState> => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    const cartData = response.data.cart;
    return {
      productsInCart: cartData.items.map((item: any) => ({
        ...item.product,
        quantity: item.quantity,
      })),
      subtotal: cartData.items.reduce(
        (acc: number, item: any) => acc + item.product.price * item.quantity,
        0
      ),
      userId,
    };
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return { productsInCart: [], subtotal: 0, userId }; // Default state if error
  }
};

// Initial state setup
const initialState: CartState = { productsInCart: [], subtotal: 0, userId: "" };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set the cart data (used for loading from the backend)
    setCartData: (state, action: PayloadAction<CartState>) => {
      state.productsInCart = action.payload.productsInCart;
      state.subtotal = action.payload.subtotal;
      state.userId = action.payload.userId;  // Update the userId as well
    },

    // Add a product to the cart
    addProductToTheCart: (state, action: PayloadAction<ProductInCart>) => {
      const product = state.productsInCart.find(
        (product) => product.id === action.payload.id
      );

      if (product) {
        state.productsInCart = state.productsInCart.map((product) => {
          if (product.id === action.payload.id) {
            return {
              ...product,
              quantity: product.quantity + action.payload.quantity,
            };
          }
          return product;
        });
      } else {
        state.productsInCart.push(action.payload);
      }

      // Recalculate the total price
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    // Remove a product from the cart
    removeProductFromTheCart: (state, action: PayloadAction<{ id: string }>) => {
      state.productsInCart = state.productsInCart.filter(
        (product) => product.id !== action.payload.id
      );
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    // Update the quantity of a product in the cart
    updateProductQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      state.productsInCart = state.productsInCart.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            quantity: action.payload.quantity,
          };
        }
        return product;
      });
      cartSlice.caseReducers.calculateTotalPrice(state);
    },

    // Calculate the total price (subtotal)
    calculateTotalPrice: (state) => {
      state.subtotal = state.productsInCart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
    },

    // Set the userId (when a user logs in) and fetch the cart
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      fetchCartFromAPI(state.userId).then((cartData) => {
        state.productsInCart = cartData.productsInCart;
        state.subtotal = cartData.subtotal;
      });
    },
  },
});

// Exporting actions
export const {
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  calculateTotalPrice,
  setCartData,
  setUserId, // Export the setUserId action
} = cartSlice.actions;

export default cartSlice.reducer;
