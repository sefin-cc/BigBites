import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../../auth/authApi'; // Using CSRF-protected baseQuery

// Define a type for AddOn
interface AddOn {
  id: number;
  item_id: number;
  label: string;
  price: number;
  created_at: string;
  updated_at: string;
}

// Example usage with an array of add-ons
type AddOns = AddOn[];

export const addOnApi = createApi({
  reducerPath: 'addOnApi',
  baseQuery: baseQueryWithCsrf, // Use CSRF-protected baseQuery
  tagTypes: ['AddOn'], // Define tag for caching

  endpoints: (builder) => ({
    // Get all add-ons
    getAddOns: builder.query<AddOns, void>({
      query: () => '/addons',
      providesTags: ['AddOn'], // Provides cache tag
    }),

    // Get add-on by ID
    getAddOnById: builder.query<AddOn, number>({
      query: (id) => `/addons/${id}`,
      providesTags: (result, error, id) => [{ type: 'AddOn', id }],
    }),

    // Add a new add-on
    addAddOn: builder.mutation<AddOn, Partial<AddOn>>({
      query: (newAddOn) => ({
        url: '/addons',
        method: 'POST',
        body: newAddOn,
      }),
      invalidatesTags: ['AddOn'], // Invalidate cache after adding
    }),

    // Update an existing add-on
    updateAddOn: builder.mutation<AddOn, { id: number; data: Partial<AddOn> }>({
      query: ({ id, data }) => ({
        url: `/addons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AddOn'], // Invalidate cache after updating
    }),

    // Delete an add-on
    deleteAddOn: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/addons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AddOn'], // Invalidate cache after deleting
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAddOnsQuery,
  useGetAddOnByIdQuery,
  useAddAddOnMutation,
  useUpdateAddOnMutation,
  useDeleteAddOnMutation,
} = addOnApi;
