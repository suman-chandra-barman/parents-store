import { baseApi } from "@/services/baseApi";
import type {
  ProductItem,
  ProductsResponse,
  SingleProductResponse,
  GetProductsParams,
} from "../types/products";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductItem[], GetProductsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.limit) queryParams.set("limit", String(params.limit));
        if (params?.category) queryParams.set("category", params.category);
        if (params?.search) queryParams.set("search", params.search);
        if (params?.sortBy) queryParams.set("sortBy", params.sortBy);

        const qs = queryParams.toString();
        return {
          url: qs ? `/products?${qs}` : "/products",
          method: "GET",
        };
      },
      transformResponse: (response: ProductsResponse) => {
        if (!response?.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Products" as const, id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    getProductById: builder.query<ProductItem | null, string>({
      query: (id) => ({
        url: `/products/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      transformResponse: (response: SingleProductResponse) => {
        if (!response?.success || !response.data) {
          return null;
        }
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
} = productsApi;
