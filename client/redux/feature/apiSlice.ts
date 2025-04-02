import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./auth/baseQuery"; 
import { Promo, Branch } from "@/types/clients";

// Create API Slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    getAddons: builder.query<any, void>({
      query: () => "/addons",
    }),
    getBranches: builder.query<Branch[], void>({
      query: () => "/branches",
    }),
    getCategories: builder.query<any, void>({
      query: () => "/categories",
    }),
    getItems: builder.query<any, void>({
      query: () => "/items",
    }),
    getMenu: builder.query<any, void>({
      query: () => "/menu",
    }),
    getPromos: builder.query<Promo[], void>({
      query: () => "/promos",
    }),
    getSubcategories: builder.query<any, void>({
      query: () => "/subcategories",
    }),
  }),
});

// Export Hooks
export const {
  useGetAddonsQuery,
  useGetBranchesQuery,
  useGetCategoriesQuery,
  useGetItemsQuery,
  useGetMenuQuery,
  useGetPromosQuery,
  useGetSubcategoriesQuery,
} = apiSlice;
