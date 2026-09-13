import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Tenant",
    "User",
    "AccessCards",
    "Orders",
    "PriceLists",
    "PaperFormats",
    "PreRegistration",
    "Cart",
    "Favorites",
    "Albums",
    "AlbumPhotos",
    "Products",
    "GiftVouchers",
  ],
});
