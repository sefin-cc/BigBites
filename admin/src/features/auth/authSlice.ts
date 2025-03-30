import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Admin } from './authApi';

// Define the initial state
interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
}

// Load admin data from localStorage if available
const storedAdmin = localStorage.getItem('admin');

const initialState: AuthState = {
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  isAuthenticated: !!storedAdmin, // Convert stored value to boolean
  isLoggingOut: false,
};

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('admin', JSON.stringify(action.payload)); // Save to localStorage
    },
    clearAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin'); // Clear storage on logout
    },
    logoutRequest: (state) => {
      state.isLoggingOut = true; // 🔹 Set when logout starts
    },
  },
});

// Export actions
export const { setAdmin, clearAdmin, logoutRequest  } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
