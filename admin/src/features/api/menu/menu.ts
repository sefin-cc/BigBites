import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface AddOn {
  id: number;
  item_id: number;
  label: string;
  price: number;
  created_at: string;
  updated_at: string;
}

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
  add_ons: AddOn[];
}

interface SubCategory {
  id: number;
  category_id: number;
  label: string;
  created_at: string;
  updated_at: string;
  items: Item[];
}

interface Category {
  id: number;
  category: string;
  created_at: string;
  updated_at: string;
  sub_categories: SubCategory[];
}

// Define a type for the menu list
type CategoryList = Category[];

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getMenu: builder.query<CategoryList, void>({
      query: () => '/menu',
    }),
  }),
});

// ✅ Export hooks for usage in components
export const { useGetMenuQuery } = menuApi;
