import { baseApi } from "@/services/baseApi";
import type {
  CreateOrderPayload,
  CreateOrderFromCartPayload,
  CreateOrderResponse,
  PriceListResponse,
  PriceListFormatItem,
  InvoiceData,
  InvoiceResponse,
} from "../types/orders";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPriceList: builder.query<PriceListFormatItem[], string>({
      query: (priceListId) => ({
        url: `/price-lists/${encodeURIComponent(priceListId)}`,
        method: "GET",
      }),
      transformResponse: (response: PriceListResponse) => {
        return response?.data?.format || [];
      },
      providesTags: ["PriceLists"],
    }),

    getAllPriceLists: builder.query<PriceListFormatItem[], void>({
      query: () => ({
        url: "/price-lists",
        method: "GET",
      }),
      transformResponse: (response: {
        data?: { isDefault?: boolean; format?: PriceListFormatItem[] }[];
      }) => {
        const lists = response?.data || [];
        if (Array.isArray(lists) && lists.length > 0) {
          const defaultList = lists.find((l) => l.isDefault) || lists[0];
          return defaultList?.format || [];
        }
        return [];
      },
      providesTags: ["PriceLists"],
    }),

    createOrder: builder.mutation<CreateOrderResponse, CreateOrderPayload>({
      query: (payload) => ({
        url: "/orders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    createOrderFromCart: builder.mutation<
      CreateOrderResponse,
      CreateOrderFromCartPayload
    >({
      query: (payload) => ({
        url: "/orders/from-cart",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    getInvoiceByOrderSlug: builder.query<InvoiceData, string>({
      query: (orderSlug) => ({
        url: `/invoices/order/${encodeURIComponent(orderSlug)}`,
        method: "GET",
      }),
      transformResponse: (response: InvoiceResponse) => {
        return response?.data;
      },
      providesTags: (_result, _error, orderSlug) => [
        { type: "Orders", id: orderSlug },
      ],
    }),
  }),
});

export const {
  useGetPriceListQuery,
  useLazyGetPriceListQuery,
  useGetAllPriceListsQuery,
  useLazyGetAllPriceListsQuery,
  useCreateOrderMutation,
  useCreateOrderFromCartMutation,
  useGetInvoiceByOrderSlugQuery,
  useLazyGetInvoiceByOrderSlugQuery,
} = ordersApi;

