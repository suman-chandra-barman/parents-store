import { baseApi } from "@/services/baseApi";
import type {
  PreRegistrationFormResponse,
  PreRegistrationSubmitResponse,
} from "../types/pre-registration";
import type { PreRegistrationSubmitValues } from "../utils/pre-registration-schema";

export const preRegistrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreRegistrationForm: builder.query<PreRegistrationFormResponse, string>({
      query: (password) => ({
        url: `/job-pre-registration-form/by-password/${encodeURIComponent(
          password
        )}`,
        method: "GET",
      }),
      providesTags: ["PreRegistration"],
    }),

    submitPreRegistration: builder.mutation<
      PreRegistrationSubmitResponse,
      PreRegistrationSubmitValues
    >({
      query: (values) => ({
        url: "/job-pre-registration-form/register",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["PreRegistration"],
    }),
  }),
});

export const {
  useGetPreRegistrationFormQuery,
  useLazyGetPreRegistrationFormQuery,
  useSubmitPreRegistrationMutation,
} = preRegistrationApi;
