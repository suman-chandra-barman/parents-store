import { baseApi } from "@/services/baseApi";
import type { AccessCardsResponse } from "../types/access-cards";

export const accessCardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccessCardsGallery: builder.query<AccessCardsResponse, string>({
      query: (password) => ({
        url: "/photo-galleries/access-cards",
        method: "GET",
        params: {
          passwords: password.trim(),
        },
      }),
      providesTags: ["AccessCards"],
    }),
  }),
});

export const {
  useGetAccessCardsGalleryQuery,
  useLazyGetAccessCardsGalleryQuery,
} = accessCardsApi;
