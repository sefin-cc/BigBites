import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../auth/authApi';

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

// Define the API slice
export const branchApi = createApi({
  reducerPath: 'branchApi',
   baseQuery: baseQueryWithCsrf,
  
  tagTypes: ['Branch'], 
  endpoints: (builder) => ({
    //  Get all branches
    getBranches: builder.query<Branch[], void>({
      query: () => '/branches',
      providesTags: ['Branch'], 
    }),

    //  Get branch by ID
    getBranchById: builder.query<Branch, string>({
      query: (id) => `/branches/${id}`,
      providesTags: (result, error, id) => [{ type: 'Branch', id }],
    }),

    //  Add a new branch
    addBranch: builder.mutation<Branch, Partial<Branch>>({
      query: (newBranch) => ({
        url: '/branches',
        method: 'POST',
        body: newBranch,
      }),
      invalidatesTags: ['Branch'], 
    }),

    //  Update an existing branch
    updateBranch: builder.mutation<Branch, { id: string; updates: Partial<Branch> }>({
      query: ({ id, updates }) => ({
        url: `/branches/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Branch'], 
    }),

    // Delete a branch
    deleteBranch: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/branches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Branch'], 
    }),
  }),
});

// Export hooks for usage in components
export const { 
  useGetBranchesQuery, 
  useGetBranchByIdQuery, 
  useAddBranchMutation, 
  useUpdateBranchMutation, 
  useDeleteBranchMutation 
} = branchApi;
