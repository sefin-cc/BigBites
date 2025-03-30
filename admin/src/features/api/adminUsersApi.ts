import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../auth/authApi'; // Using CSRF-protected baseQuery

interface RolePivot {
    model_type: string;
    model_id: number;
    role_id: number;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: RolePivot;
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
    roles: Role[];
}

// Example usage for an array of admins
type Admins = Admin[];

export const adminUserApi = createApi({
  reducerPath: 'adminUserApi',
  baseQuery: baseQueryWithCsrf, // Use the same CSRF-protected baseQuery
  tagTypes: ['Admin'], // Define tag for caching

  endpoints: (builder) => ({
    // Get all admins
    getAdmins: builder.query<Admins, void>({
      query: () => '/admin/index',
      providesTags: ['Admin'], // Provides cache tag
    }),

    // Get admin by ID
    getAdminById: builder.query<Admin, number>({
      query: (id) => `/admin/show/${id}`,
      providesTags: (result, error, id) => [{ type: 'Admin', id }],
    }),

    // Register a new admin
    registerAdmin: builder.mutation<Admin, { name: string; email: string; phone: string; address: string; branch: string; role: number }>({
      query: (adminData) => ({
        url: '/admin/register',
        method: 'POST',
        body: adminData,
      }),
      invalidatesTags: ['Admin'], // Invalidate cache after adding
    }),

    // Update an existing admin
    updateAdmin: builder.mutation<Admin, { id: number; data:{ name: string; email: string; phone: string; address: string; branch: string; role: number }}>({
      query: ({ id, data }) => ({
        url: `/admin/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'], // Invalidate cache after updating
    }),

    // Delete an admin
    deleteAdmin: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/admin/destroy/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'], // Invalidate cache after deleting
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useRegisterAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminUserApi;
