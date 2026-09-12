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

    updateCartItemQuantity: builder.mutation<
      CartResponse,
      { sessionId: string; itemId: string | number; quantity: number }
    >({
      query: ({ sessionId, itemId, quantity }) => ({
        url: `/carts/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(itemId)}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<
      CartResponse,
      { sessionId: string; itemId: string | number }
    >({
      query: ({ sessionId, itemId }) => ({
        url: `/carts/${encodeURIComponent(sessionId)}/items/${encodeURIComponent(itemId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    applyGiftVoucher: builder.mutation<
      CartResponse,
      { sessionId: string; code: string }
    >({
      query: ({ sessionId, code }) => ({
        url: `/carts/${encodeURIComponent(sessionId)}/voucher`,
        method: "POST",
        body: { code },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeGiftVoucher: builder.mutation<CartResponse, string>({
      query: (sessionId) => ({
        url: `/carts/${encodeURIComponent(sessionId)}/voucher`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<CartResponse, string>({
      query: (sessionId) => ({
        url: `/carts/${encodeURIComponent(sessionId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useApplyGiftVoucherMutation,
  useRemoveGiftVoucherMutation,
  useClearCartMutation,
} = cartApi;

