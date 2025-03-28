import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../auth/authApi'; 

// Define a type for Promo
interface Promo {
  id: number;
  label: string;
  image: string;
}

// Define the API slice
export const promoApi = createApi({
  reducerPath: 'promoApi',
  baseQuery: baseQueryWithCsrf, // Use the same CSRF-protected baseQuery
  tagTypes: ['Promo'], // Define tag for caching

  endpoints: (builder) => ({
    // Get all promos
    getPromos: builder.query<Promo[], void>({
      query: () => '/promos',
      providesTags: ['Promo'], // Provides cache tag
    }),

    // Get promo by ID
    getPromoById: builder.query<Promo, number>({
      query: (id) => `/promos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Promo', id }],
    }),

    // Add a new promo
    addPromo: builder.mutation<Promo, Partial<Promo>>({
      query: (newPromo) => ({
        url: '/promos',
        method: 'POST',
        body: newPromo,
      }),
      invalidatesTags: ['Promo'], // Invalidate cache after adding
    }),

    // Update an existing promo
    updatePromo: builder.mutation<Promo, { id: number; data: Partial<Promo> }>({
      query: ({ id, data }) => ({
        url: `/promos/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Promo'], // Invalidate cache after updating
    }),

    // Delete a promo
    deletePromo: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/promos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promo'], // Invalidate cache after deleting
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPromosQuery,
  useGetPromoByIdQuery,
  useAddPromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation,
} = promoApi;
