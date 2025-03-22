import { configureStore } from '@reduxjs/toolkit';
import { branchApi } from './features/api/apiSlice';
import { authApi } from './features/auth/authApi';

export const store = configureStore({
  reducer: {
    [branchApi.reducerPath]: branchApi.reducer,
    [authApi.reducerPath]: authApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(branchApi.middleware, authApi.middleware), // Combine middleware
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
