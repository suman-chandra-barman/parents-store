import { baseApi } from "@/services/baseApi";
import type {
  AccessCardsResponse,
  TwoFactorStatusResponse,
  TwoFactorVerifyResponse,
} from "../types/access-cards";

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
    checkTwoFactorStatus: builder.query<TwoFactorStatusResponse, string>({
      query: (password) => ({
        url: "/photo-galleries/access-cards/2fa-status",
        method: "GET",
        params: {
          password: password.trim(),
        },
      }),
    }),
    verifyTwoFactorPassword: builder.query<
      TwoFactorVerifyResponse,
      { password: string; twoFactorPassword: string }
    >({
      query: ({ password, twoFactorPassword }) => ({
        url: "/photo-galleries/access-cards/2fa-verify",
        method: "GET",
        params: {
          password: password.trim(),
          twoFactorPassword: twoFactorPassword.trim(),
        },
      }),
    }),
  }),
});

export const {
  useGetAccessCardsGalleryQuery,
  useLazyGetAccessCardsGalleryQuery,
  useLazyCheckTwoFactorStatusQuery,
  useLazyVerifyTwoFactorPasswordQuery,
} = accessCardsApi;
