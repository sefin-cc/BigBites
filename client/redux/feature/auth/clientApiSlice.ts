import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery"; // Import the shared baseQuery
import type { AuthResponse, RegisterRequest, LoginRequest, Client, RegisterResponse } from "../../../types/clients";
import { setToken, clearToken } from "../../feature/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery, // Use the exported baseQuery
  endpoints: (builder) => ({

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (clientData) => ({
        url: "/client/register",
        method: "POST",
        body: clientData,
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.token)); // Store token in Redux
          await AsyncStorage.setItem("authToken", data.token); // Store in AsyncStorage
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/client/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.token)); // Store token in Redux
          await AsyncStorage.setItem("authToken", data.token); // Store in AsyncStorage
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/client/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; // Wait for successful logout response
          dispatch(clearToken());
          await AsyncStorage.removeItem("authToken");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    

    updateFavourites: builder.mutation<Client, { userId: number; favourites: any[] }>({
      query: ({ userId, favourites }) => ({
        url: `/client/update_favourites/${userId}`, 
        method: "POST",
        body: { favourites }, 
      }),
    }),

    getProfile: builder.query<Client, void>({
      query: () => ({
        url: '/client',
        method: 'GET',
      }),
    }),

  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateFavouritesMutation
} = clientApi;
