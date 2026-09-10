import { baseApi } from "@/services/baseApi";
import type {
  PaperFormatItem,
  PaperFormatsResponse,
} from "../types/paper-formats";

export const paperFormatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaperFormats: builder.query<PaperFormatItem[], void>({
      query: () => ({
        url: "/paper-formats",
        method: "GET",
      }),
      transformResponse: (response: PaperFormatsResponse) => {
        if (!response?.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data.filter((item) => item.type === "FORMAT");
      },
      providesTags: ["PaperFormats"],
    }),
  }),
});

export const { useGetPaperFormatsQuery, useLazyGetPaperFormatsQuery } =
  paperFormatsApi;
