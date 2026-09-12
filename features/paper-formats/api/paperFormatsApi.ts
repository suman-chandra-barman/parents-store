import { baseApi } from "@/services/baseApi";
import type {
  PaperFormatItem,
  PaperFormatsResponse,
  FilterPhotosResponse,
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
    getPackagesByPhotoIds: builder.query<
      PaperFormatItem[],
      { photoIds: string[] }
    >({
      query: (body) => ({
        url: "/paper-formats/packages-by-photo-ids",
        method: "POST",
        body,
      }),
      transformResponse: (response: PaperFormatsResponse) => {
        if (!response?.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data;
      },
      providesTags: ["PaperFormats"],
    }),
    filterPhotosByFormat: builder.query<
      string[],
      { formatId: string; photoIds: string[] }
    >({
      query: ({ formatId, photoIds }) => ({
        url: `/paper-formats/filter-photos?formatId=${encodeURIComponent(
          formatId
        )}`,
        method: "POST",
        body: { photoIds },
      }),
      transformResponse: (response: FilterPhotosResponse) => {
        if (!response?.success || !Array.isArray(response.data)) {
          return [];
        }
        return response.data;
      },
    }),
  }),
});

export const {
  useGetPaperFormatsQuery,
  useLazyGetPaperFormatsQuery,
  useGetPaperFormatsByAlbumPhotoQuery,
  useLazyGetPaperFormatsByAlbumPhotoQuery,
  useGetPackagesByPhotoIdsQuery,
  useLazyGetPackagesByPhotoIdsQuery,
  useFilterPhotosByFormatQuery,
  useLazyFilterPhotosByFormatQuery,
} = paperFormatsApi;

