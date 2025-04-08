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

// Define a type for Item
interface Item {
  id: number;
  sub_category_id: number;
  label: string;
  full_label: string;
  description: string;
  price: number;
  time: string;
  image: string;
  created_at: string;
  updated_at: string;
  add_ons: AddOn[]; // Includes add-ons related to the item
}

// Example usage with an array of items
type Items = Item[];

export const itemApi = createApi({
  reducerPath: 'itemApi',
  baseQuery: baseQueryWithCsrf, // Use the same CSRF-protected baseQuery
  tagTypes: ['Item'], // Define tag for caching

  endpoints: (builder) => ({
    // Get all items
    getItems: builder.query<Items, void>({
      query: () => '/items',
      providesTags: ['Item'], // Provides cache tag
    }),

    // Get item by ID
    getItemById: builder.query<Item, number>({
      query: (id) => `/items/${id}`,
      providesTags: (...[, , id]) => [{ type: 'Item', id }],
    }),

    // Add a new item
    addItem: builder.mutation<Item, Partial<Item>>({
      query: (newItem) => ({
        url: '/items',
        method: 'POST',
        body: newItem,
      }),
      invalidatesTags: ['Item'], // Invalidate cache after adding
    }),

    // Update an existing item
    updateItem: builder.mutation<Item, { id: number; data: Partial<Item> }>({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Item'], // Invalidate cache after updating
    }),

    // Delete an item
    deleteItem: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Item'], // Invalidate cache after deleting
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi;
