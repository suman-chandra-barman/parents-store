export interface ProductMediaMetadata {
  originalName?: string;
  [key: string]: unknown;
}

export interface ProductMedia {
  id: string;
  url: string;
  bytes?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  metadata?: ProductMediaMetadata;
  type?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  price: string;
  vatRate?: string;
  isVisible: boolean;
  userId?: number;
  availableFrom?: string;
  availableTo?: string;
  createdAt?: string;
  updatedAt?: string;
  medias?: ProductMedia[];
}

export interface ProductPagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination?: ProductPagination;
  data: ProductItem[];
}

export interface SingleProductResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ProductItem;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "title";
}
