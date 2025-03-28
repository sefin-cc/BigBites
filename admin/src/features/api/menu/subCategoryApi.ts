import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../../auth/authApi'; // Using CSRF-protected baseQuery

// Define a type for SubCategory
interface SubCategory {
    id: number;
    category_id: number;
    label: string;
}

export const subCategoryApi = createApi({
  reducerPath: 'subCategoryApi',
  baseQuery: baseQueryWithCsrf, // Use the same CSRF-protected baseQuery
  tagTypes: ['SubCategory'], // Define tag for caching

  endpoints: (builder) => ({
    // Get all subcategories
    getSubCategories: builder.query<SubCategory[], void>({
      query: () => '/subcategories',
      providesTags: ['SubCategory'], // Provides cache tag
    }),

    // Get subcategory by ID
    getSubCategoryById: builder.query<SubCategory, number>({
      query: (id) => `/subcategories/${id}`,
      providesTags: (result, error, id) => [{ type: 'SubCategory', id }],
    }),

    // Add a new subcategory
    addSubCategory: builder.mutation<SubCategory, Partial<SubCategory>>({
      query: (newSubCategory) => ({
        url: '/subcategories',
        method: 'POST',
        body: newSubCategory,
      }),
      invalidatesTags: ['SubCategory'], // Invalidate cache after adding
    }),

    // Update an existing subcategory
    updateSubCategory: builder.mutation<SubCategory, { id: number; data: Partial<SubCategory> }>({
      query: ({ id, data }) => ({
        url: `/subcategories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SubCategory'], // Invalidate cache after updating
    }),

    // Delete a subcategory
    deleteSubCategory: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/subcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategory'], // Invalidate cache after deleting
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
