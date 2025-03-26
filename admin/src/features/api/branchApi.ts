import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a type for the Branch
interface Branch {
    id: string;
    branchName: string;
    province: string;
    city: string;
    fullAddress: string;
    openingTime: string;
    closingTime: string;
    acceptAdvancedOrder: boolean;
}


export const branchApi = createApi({
  reducerPath: 'branchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include', 
  }),
  endpoints: (builder) => ({
    getBranches: builder.query<Branch[], void>({
      query: () => '/branches',
    }),
    getBranchById: builder.query<Branch, number>({
      query: (id) => `/branches/${id}`,
    }),
    addBranch: builder.mutation<Branch, Partial<Branch>>({
      query: (newBranch) => ({
        url: '/branches',
        method: 'POST',
        body: newBranch,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { 
  useGetBranchesQuery, 
  useGetBranchByIdQuery, 
  useAddBranchMutation 
} = branchApi;
