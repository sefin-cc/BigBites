import { createApi } from "@reduxjs/toolkit/query/react";
import { Order } from "../../types/clients";
import {baseQuery} from './auth/baseQuery'

// Create API Slice for Orders
export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery,
    endpoints: (builder) => ({
      getOrders: builder.query<Order[], void>({
        query: () => "/orders",
      }),
  
      createOrder: builder.mutation<Order, Partial<Order>>({
        query: (orderData) => ({
          url: "/orders",
          method: "POST",
          body: orderData,
        }),
      }),
    }),
  });
  

// Export Hooks
export const { useGetOrdersQuery, useCreateOrderMutation } = ordersApi;
