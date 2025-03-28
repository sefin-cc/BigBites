import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../auth/authApi'; // Using CSRF-protected baseQuery

interface OrderItem {
    itemId: string;
    label: string;
    price: number;
    qty: number;
}

interface DiscountCardDetails {
    name: string | null;
    discountCard: string | null;
}

interface Fees {
    subTotal: number;
    deliveryFee: number;
    discountDeduction: number;
    grandTotal: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Branch {
    id: number;
    branchName: string;
    province: string;
    city: string;
    fullAddress: string;
    openingTime: string;
    closingTime: string;
    acceptAdvancedOrder: boolean;
    created_at: string;
    updated_at: string;
}

interface Location {
    description: string;
}

export interface Order {
    id: number;
    user_id: number;
    type: string;
    pick_up_type: string;
    location: Location | null;
    branch_id: number;
    order_items: OrderItem[];
    base_price: number;
    timestamp: string;
    date_time_pickup: string;
    status: string;
    discount_card_details: DiscountCardDetails;
    fees: Fees;
    created_at: string;
    updated_at: string;
    user: User;
    branch: Branch;
}

// Example usage with an array of orders
type Orders = Order[];

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithCsrf, // Use the same CSRF-protected baseQuery
  tagTypes: ['Order'], // Define tag for caching

  endpoints: (builder) => ({
    // Get all orders
    getOrders: builder.query<Orders, void>({
      query: () => '/orders',
      providesTags: ['Order'], // Provides cache tag
    }),

    // Get order by ID
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    // Add a new order
    addOrder: builder.mutation<Order, Partial<Order>>({
      query: (newOrder) => ({
        url: '/orders',
        method: 'POST',
        body: newOrder,
      }),
      invalidatesTags: ['Order'], // Invalidate cache after adding
    }),

    // Update an existing order
    updateOrder: builder.mutation<Order, { id: number; data: Partial<Order> }>({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Order'], // Invalidate cache after updating
    }),

    // Delete an order
    deleteOrder: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'], // Invalidate cache after deleting
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
