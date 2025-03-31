import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { setAdmin, clearAdmin, logoutRequest } from './authSlice';

// Define the types
interface LoginRequest {
  email: string;
  password: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  branch: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  admin: Admin;
}

interface LogoutResponse {
  message: string;
}

// Function to fetch CSRF token
export const fetchCsrfToken = async () => {
  await fetch(`${import.meta.env.VITE_BACKEND_URL}csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  });
};

// Function to add XSRF-TOKEN to headers
const withXSRFToken = (headers: Headers) => {
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  
  headers.set('Accept', 'application/json'); //  Ensure JSON response format

  if (xsrfToken) {
    headers.set('X-XSRF-TOKEN', xsrfToken);
  } else {
    console.warn('XSRF-TOKEN NOT FOUND');
  }

  return headers;
};

// Base Query with CSRF Protection
export const baseQueryWithCsrf = async (args: any, api: any, extraOptions: any) => {
  if (args.method && args.method !== 'GET' && args.url !== 'admin/logout') {
    await fetchCsrfToken(); // Ensure CSRF token is fetched first
  }

  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include',
    prepareHeaders: (headers) => withXSRFToken(headers), // Apply XSRF Token
  });

  return baseQuery(args, api, extraOptions);
};

//  Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithCsrf,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'admin/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdmin(data.admin)); // Store user session
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: 'admin/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutRequest()); 
          dispatch(clearAdmin()); // Clear session on logout
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),

    getLoggedInAdmin: builder.query<Admin, void>({
      query: () => ({
        url: 'admin',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdmin(data)); // Store user session
        } catch (error) {
          dispatch(clearAdmin()); 
        }
      },
      providesTags: ['User'], 
    }),


    updateAccount: builder.mutation<Admin, { id: number; data:{ name: string; email: string; phone: string; address: string; branch: string; image: string | null;}}>({
      query: ({ id, data }) => ({
        url: `/admin/update_account/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'], 
    }),
    
    updatePassword: builder.mutation<Admin, { id: number; data: { old_password: string; new_password: string; new_password_confirmation: string } }>(
      {
        query: ({ id, data }) => ({
          url: `/admin/update_password/${id}`, 
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['User'], 
      }),

  }),
});

// Export hooks for usage in components
export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useGetLoggedInAdminQuery,
  useUpdateAccountMutation,
  useUpdatePasswordMutation 
} = authApi;