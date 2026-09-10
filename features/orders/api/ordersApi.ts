import { baseApi } from "@/services/baseApi";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  PriceListResponse,
  PriceListFormatItem,
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
  }),
});

export const {
  useGetPriceListQuery,
  useLazyGetPriceListQuery,
  useGetAllPriceListsQuery,
  useLazyGetAllPriceListsQuery,
  useCreateOrderMutation,
} = ordersApi;
