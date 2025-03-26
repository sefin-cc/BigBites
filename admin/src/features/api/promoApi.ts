import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a type for Promo
interface Promo {
  id: number;
  label: string;
  image: string;
}

export const promoApi = createApi({
  reducerPath: 'promoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getPromos: builder.query<Promo[], void>({
      query: () => '/promos',
    }),
    getPromoById: builder.query<Promo, number>({
      query: (id) => `/promos/${id}`,
    }),
    addPromo: builder.mutation<Promo, Partial<Promo>>({
      query: (newPromo) => ({
        url: '/promos',
        method: 'POST',
        body: newPromo,
      }),
    }),
    updatePromo: builder.mutation<Promo, { id: number; data: Partial<Promo> }>({
      query: ({ id, data }) => ({
        url: `/promos/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePromo: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/promos/${id}`,
        method: 'DELETE',
      }),
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
