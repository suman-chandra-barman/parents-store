export interface FormatSize {
  id: string;
  groupId?: string | null;
  title: string;
  description?: string | null;
  tenantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormatCategory {
  id: string;
  title: string;
  description?: string | null;
  groupId?: string | null;
  tenantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormatPrice {
  id: string;
  fromQuantity: number;
  price: string;
  formatId: string;
  isDefault?: boolean;
  tenantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaperFormatItem {
  id: string;
  kind: string;
  type: "FORMAT" | "PACKAGE" | string;
  sizeId?: string;
  title: string;
  description?: string | null;
  categoryId?: string | null;
  oneOffCost?: string;
  shippingCost?: string;
  shippingCostMode?: string;
  isPhotoDownloadable?: boolean;
  tenantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  size?: FormatSize | null;
  category?: FormatCategory | null;
  prices?: FormatPrice[];
  packages?: unknown[];
  isMine?: boolean;
}

export interface PaperFormatsPagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface PaperFormatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  traceId?: string;
  pagination?: PaperFormatsPagination;
  data: PaperFormatItem[];
}
