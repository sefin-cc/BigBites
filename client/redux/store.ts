import { configureStore } from "@reduxjs/toolkit";
import authReducer, { restoreToken } from "../redux/feature/authSlice";
import { clientApi } from "../redux/feature/auth/clientApiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from '../redux/feature/apiSlice'
import { ordersApi } from "../redux/feature/ordersApi"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      clientApi.middleware,
      apiSlice.middleware,
      ordersApi.middleware
    ),
});

// Restore token when app loads
const loadStoredToken = async () => {
  const token = await AsyncStorage.getItem("authToken");
  store.dispatch(restoreToken(token)); // Restore token from storage
};

loadStoredToken(); // Run when app starts

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
