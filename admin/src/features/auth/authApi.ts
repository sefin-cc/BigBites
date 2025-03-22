import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

// Define the types
interface LoginRequest {
  email: string;
  password: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  branch: string;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  admin: Admin;
}

// ✅ Function to fetch CSRF token
const fetchCsrfToken = async () => {
  await fetch(`${import.meta.env.VITE_BACKEND_URL}csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  });
};

// ✅ Function to add XSRF-TOKEN to headers
const withXSRFToken = (headers: Headers) => {
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  
  headers.set('Accept', 'application/json'); // ✅ Ensure JSON response format

  if (xsrfToken) {
    headers.set('X-XSRF-TOKEN', xsrfToken);
  } else {
    console.warn('XSRF-TOKEN NOT FOUND');
  }

  return headers;
};

// ✅ Base Query with CSRF Protection
const baseQueryWithCsrf = async (args: any, api: any, extraOptions: any) => {
  if (args.method && args.method !== 'GET' && args.url !== 'admin/logout') {
    await fetchCsrfToken(); // Ensure CSRF token is fetched first
  }

  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include',
    prepareHeaders: (headers) => withXSRFToken(headers), // ✅ Apply XSRF Token
  });

  return baseQuery(args, api, extraOptions);
};

// ✅ Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithCsrf,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'admin/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
