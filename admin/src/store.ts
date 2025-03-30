import { configureStore } from '@reduxjs/toolkit';
import { branchApi } from './features/api/branchApi';
import { authApi } from './features/auth/authApi';
import { promoApi } from './features/api/promoApi';
import { subCategoryApi } from './features/api/menu/subCategoryApi';
import { itemApi } from './features/api/menu/itemApi';
import { addOnApi } from './features/api/menu/addOnApi';
import { menuApi } from './features/api/menu/menu';
import { orderApi } from './features/api/orderApi';
import { adminUserApi } from './features/api/adminUsersApi';
import authReducer from './features/auth/authSlice';
import loadingReducer from './features/loadingSlice';


export const store = configureStore({
  reducer: {
    [branchApi.reducerPath]: branchApi.reducer,
    [authApi.reducerPath]: authApi.reducer, 
    [promoApi.reducerPath]: promoApi.reducer,
    [subCategoryApi.reducerPath]: subCategoryApi.reducer,
    [addOnApi.reducerPath]: addOnApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [adminUserApi.reducerPath]: adminUserApi.reducer,
    auth: authReducer,
    loading: loadingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      branchApi.middleware, 
      authApi.middleware, 
      promoApi.middleware,
      subCategoryApi.middleware,
      itemApi.middleware,
      addOnApi.middleware,
      menuApi.middleware,
      orderApi.middleware,
      adminUserApi.middleware
    ), 
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
