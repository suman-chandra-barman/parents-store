import { baseApi } from "@/services/baseApi";
import type { AddCartItemPayload, CartResponse } from "../types/cart";
import { setCartSessionId } from "../utils/cart-api";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, string>({
      query: (sessionId) => ({
        url: `/carts/${encodeURIComponent(sessionId)}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      CartResponse,
      { sessionId: string; payload: AddCartItemPayload }
    >({
      query: ({ sessionId, payload }) => ({
        url: `/carts/${encodeURIComponent(sessionId)}/items`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.sessionId) {
            setCartSessionId(data.data.sessionId);
          }
        } catch {
          // Handled by component / hook
        }
      },
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation } = cartApi;
