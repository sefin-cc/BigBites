import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';

const PAYMONGO_LINK = Constants.expoConfig?.extra?.PAYMONGO_LINK;
const PAYMONGO_SECRET_KEY = Constants.expoConfig?.extra?.PAYMONGO_SECRET_KEY;

const baseQuery = fetchBaseQuery({
  baseUrl: PAYMONGO_LINK,
  prepareHeaders: (headers) => {
    const encodedKey = btoa(`${PAYMONGO_SECRET_KEY}:`);
    headers.set('Authorization', `Basic ${encodedKey}`);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery,
  endpoints: (builder) => ({
    createPaymentLink: builder.mutation({
      query: ({ amount }) => ({
        url: 'links',
        method: 'POST',
        body: {
          data: {
            attributes: {
              amount,
              description: "BigBites Order Payment",
            },
          },
        },
      }),
    }),
    getPaymentLinkByReference: builder.query({
      query: (referenceNumber) => ({
        url: `links?reference_number=${referenceNumber}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreatePaymentLinkMutation,
  useGetPaymentLinkByReferenceQuery,
} = paymentApi;
