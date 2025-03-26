import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a type for SubCategory
interface SubCategory {
    id: number;
    category_id: number,
    label: string;
}

export const subCategoryApi = createApi({
  reducerPath: 'subCategoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include', // Ensures cookies are sent
  }),
  endpoints: (builder) => ({
    getSubCategories: builder.query<SubCategory[], void>({
      query: () => '/subcategories',
    }),
    getSubCategoryById: builder.query<SubCategory, number>({
      query: (id) => `/subcategories/${id}`,
    }),
    addSubCategory: builder.mutation<SubCategory, Partial<SubCategory>>({
      query: (newSubCategory) => ({
        url: '/subcategories',
        method: 'POST',
        body: newSubCategory,
      }),
    }),
    updateSubCategory: builder.mutation<SubCategory, { id: number; data: Partial<SubCategory> }>({
      query: ({ id, data }) => ({
        url: `/subcategories/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteSubCategory: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;
