import { baseApi } from "@/services/baseApi";
import type {
  GiftVoucherItem,
  GiftVouchersResponse,
  SingleGiftVoucherResponse,
  GetGiftVouchersParams,
} from "../types/gift-vouchers";

export const giftVouchersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGiftVouchers: builder.query<GiftVoucherItem[], GetGiftVouchersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.limit) queryParams.set("limit", String(params.limit));
        if (params?.category) queryParams.set("category", params.category);
        if (params?.search) queryParams.set("search", params.search);
        if (params?.sortBy) queryParams.set("sortBy", params.sortBy);

        const qs = queryParams.toString();
        return {
          url: qs ? `/gift-vouchers?${qs}` : "/gift-vouchers",
          method: "GET",
        };
      },
      transformResponse: (response: GiftVouchersResponse) => {
        if (!response?.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "GiftVouchers" as const, id })),
              { type: "GiftVouchers", id: "LIST" },
            ]
          : [{ type: "GiftVouchers", id: "LIST" }],
    }),

    getGiftVoucherById: builder.query<GiftVoucherItem | null, string>({
      query: (id) => ({
        url: `/gift-vouchers/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      transformResponse: (response: SingleGiftVoucherResponse) => {
        if (!response?.success || !response.data) {
          return null;
        }
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: "GiftVouchers", id }],
    }),
  }),
});

export const {
  useGetGiftVouchersQuery,
  useLazyGetGiftVouchersQuery,
  useGetGiftVoucherByIdQuery,
  useLazyGetGiftVoucherByIdQuery,
} = giftVouchersApi;
