import { baseApi } from "@/services/baseApi";
import type {
  ClassicPasswordStatusResponse,
  ClassicGalleryResponse,
} from "../types/public-galleries";

export const publicGalleriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGalleryPasswordStatus: builder.query<
      ClassicPasswordStatusResponse,
      string
    >({
      query: (jobId) => ({
        url: "/photo-galleries/classic/password-status",
        method: "GET",
        params: {
          jobId: jobId.trim(),
        },
      }),
    }),
    getClassicGallery: builder.query<
      ClassicGalleryResponse,
      { jobId: string; password?: string }
    >({
      query: ({ jobId, password }) => ({
        url: "/photo-galleries/classic",
        method: "GET",
        params: {
          jobId: jobId.trim(),
          ...(password?.trim() ? { password: password.trim() } : {}),
        },
      }),
      providesTags: ["PublicGalleries"],
    }),
  }),
});

export const {
  useGetGalleryPasswordStatusQuery,
  useLazyGetGalleryPasswordStatusQuery,
  useGetClassicGalleryQuery,
  useLazyGetClassicGalleryQuery,
} = publicGalleriesApi;
