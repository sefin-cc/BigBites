import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null, // Default state is no token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    restoreToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});
export const { setToken, clearToken, restoreToken } = authSlice.actions;
export default authSlice.reducer;
