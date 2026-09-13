export interface GiftVoucherLayoutMedia {
  id: string;
  url: string;
  bytes?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  type?: string;
}

export interface GiftVoucherLayout {
  id: string;
  name: string;
  description?: string;
  mediaId?: string | null;
  fontFamily?: string;
  createdAt?: string;
  updatedAt?: string;
  media?: GiftVoucherLayoutMedia | null;
}

export interface GiftVoucherPreview {
  id: string;
  url: string;
  bytes?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  type?: string;
}

export interface GiftVoucherItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  price: string;
  value: string;
  vatRate?: string;
  isVisible: boolean;
  previewId?: string | null;
  userId?: number;
  availableFrom?: string;
  availableTo?: string;
  createdAt?: string;
  updatedAt?: string;
  layouts?: GiftVoucherLayout[];
  preview?: GiftVoucherPreview | null;
}

export interface GiftVoucherPagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface GiftVouchersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: GiftVoucherPagination;
  data: GiftVoucherItem[];
}

export interface SingleGiftVoucherResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GiftVoucherItem;
}

export interface GetGiftVouchersParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "value_desc" | "newest" | "title";
}
