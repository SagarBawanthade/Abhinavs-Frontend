import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type of the user
type User = {
  id: string;
  role: string;
  firstName: string;
};

// Define the AuthState
type AuthState = {
  loginStatus: boolean;
  user: User | null;
  firstName: string; // User can be null, but firstName is needed as a separate field
};

const initialState: AuthState = {
  firstName: "", // Initialize with empty string
  loginStatus: false,
  user: null, // Initially null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set login status and user info
    setLoginStatus: (
      state,
      action: PayloadAction<{ loginStatus: boolean; user: User | null }>
    ) => {
      const { loginStatus, user } = action.payload;
      console.log("Setting login status and user:", action.payload); // Debugging log
      state.loginStatus = loginStatus;

      // If user is not null, update both user and firstName
      if (user) {
        state.user = user;
        state.firstName = user.firstName; // Extract firstName from user object
      } else {
        state.user = null; // If user is null, reset the user and firstName
        state.firstName = ""; // Reset firstName
      }

     
    },
    // Set only the firstName in user data
    setUserData: (
      state,
      action: PayloadAction<{ firstName: string }>
    ) => {
      if (state.user) {
        state.user.firstName = action.payload.firstName; // Update only the firstName
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...userData, ...state.user }));
      }
    },
    
    // Initialize login status from localStorage
    initializeLoginStatus: (state) => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.loginStatus) {
        state.loginStatus = user.loginStatus;
        state.user = { id: user.id, role: user.role || false, firstName: user.firstName }; // Ensure role is handled if missing
      } else {
        state.loginStatus = false;
        state.user = null;
      }
    },
    
    // Logout and remove user data from state and localStorage
    logout: (state) => {
      state.loginStatus = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setLoginStatus, initializeLoginStatus, setUserData, logout } = authSlice.actions;
export default authSlice.reducer;
