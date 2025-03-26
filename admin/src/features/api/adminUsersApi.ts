import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include', // Ensures cookies are sent
  }),
  endpoints: (builder) => ({
    getAdmins: builder.query<Admins, void>({
      query: () => '/admin/index',
    }),
    getAdminById: builder.query<Admin, number>({
      query: (id) => `/admin/show/${id}`,
    }),
    registerAdmin: builder.mutation<Admin, { name: string; email: string; password: string }>({
      query: (adminData) => ({
        url: '/admin/register',
        method: 'POST',
        body: adminData,
      }),
    }),
    updateAdmin: builder.mutation<Admin, { id: number; data: Partial<Admin> }>({
      query: ({ id, data }) => ({
        url: `/admin/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteAdmin: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/admin/destroy/${id}`,
        method: 'DELETE',
      }),
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
