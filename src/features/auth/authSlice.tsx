import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  loginStatus: boolean;
  user: { id: string; role: boolean; firstName?: string } | null; // Updated to include optional firstName
};

const initialState: AuthState = {
  loginStatus: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginStatus: (
      state,
      action: PayloadAction<{ id: string; role: boolean; loginStatus: boolean; firstName?: string }>
    ) => {
      const { id, role, loginStatus, firstName } = action.payload;
      console.log("Setting login status:", action.payload); // Debugging log
      state.loginStatus = loginStatus;
      state.user = { id, role, firstName }; // Ensure role is set here
      localStorage.setItem("user", JSON.stringify({ id, role, loginStatus, firstName }));
    },
    
    // setLoginStatus: (
    //   state,
    //   action: PayloadAction<{ id: string; role: boolean; loginStatus: boolean }>
    // ) => {
    //   const { id, role, loginStatus } = action.payload;
    //   state.loginStatus = loginStatus;
    //   state.user = { id, role };
    //   localStorage.setItem("user", JSON.stringify({ id, role, loginStatus }));
    // },
    
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
    initializeLoginStatus: (state) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.loginStatus) {
        state.loginStatus = user.loginStatus;
        state.user = { id: user.id, role: user.role || "user", firstName: user.firstName };
      } else {
        state.loginStatus = false;
        state.user = null;
      }
    },
    logout: (state) => {
      state.loginStatus = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setLoginStatus, initializeLoginStatus, setUserData, logout } = authSlice.actions;
export default authSlice.reducer;
