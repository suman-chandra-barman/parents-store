import { baseApi } from "@/services/baseApi";
import type {
  PaperFormatItem,
  PaperFormatsResponse,
} from "../types/paper-formats";

export const paperFormatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaperFormats: builder.query<PaperFormatItem[], string | void>({
      query: (albumPhotoId) => ({
        url: albumPhotoId
          ? `/paper-formats/by-album-photo/${encodeURIComponent(albumPhotoId)}`
          : "/paper-formats",
        method: "GET",
      }),
      transformResponse: (response: PaperFormatsResponse) => {
        if (!response?.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data.filter((item) => item.type === "FORMAT");
      },
      providesTags: (_result, _error, albumPhotoId) =>
        albumPhotoId
          ? [{ type: "PaperFormats", id: albumPhotoId }]
          : ["PaperFormats"],
    }),
    getPaperFormatsByAlbumPhoto: builder.query<PaperFormatItem[], string>({
      query: (albumPhotoId) => ({
        url: `/paper-formats/by-album-photo/${encodeURIComponent(albumPhotoId)}`,
        method: "GET",
      }),
      transformResponse: (response: PaperFormatsResponse) => {
        if (!response?.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data.filter((item) => item.type === "FORMAT");
      },
      providesTags: (_result, _error, albumPhotoId) => [
        { type: "PaperFormats", id: albumPhotoId },
      ],
    }),
  }),
});

export const {
  useGetPaperFormatsQuery,
  useLazyGetPaperFormatsQuery,
  useGetPaperFormatsByAlbumPhotoQuery,
  useLazyGetPaperFormatsByAlbumPhotoQuery,
} = paperFormatsApi;
