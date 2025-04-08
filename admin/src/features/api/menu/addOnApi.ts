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
  baseQuery: baseQueryWithCsrf,
  tagTypes: ['AddOn'],

  endpoints: (builder) => ({
    getAddOnsByItem: builder.query<AddOns, number>({
      query: (itemId) => `/items/${itemId}/addons`,
      providesTags: (...[, , itemId]) => [{ type: 'AddOn', id: itemId }],
    }),

    addAddOnToItem: builder.mutation<AddOn, { item_id: number; label: string; price: number }>({
      query: (newAddOn) => ({
        url: '/addons',
        method: 'POST',
        body: newAddOn,
      }),
      invalidatesTags: ['AddOn'],
    }),

    updateAddOn: builder.mutation<AddOn, { id: number; data: Partial<AddOn> }>({
      query: ({ id, data }) => ({
        url: `/addons/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AddOn'],
    }),

    deleteAddOn: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/addons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AddOn'],
    }),
  }),
});

export const {
  useGetAddOnsByItemQuery,
  useAddAddOnToItemMutation,
  useUpdateAddOnMutation,
  useDeleteAddOnMutation,
} = addOnApi;
