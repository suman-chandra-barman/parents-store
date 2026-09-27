export type GenderType = "MALE" | "FEMALE" | "NOT_SPECIFIED";

export interface OrderLocationInput {
  country: string;
  state: string;
  city: string;
  zipCode: string;
  addressLine1: string;
  note: string;
}

export interface OrderAddressInput {
  gender?: GenderType;
  firstName: string;
  lastName?: string;
  companyName?: string;
  location: OrderLocationInput;
}

export interface CreateOrderItemInput {
  formatId: string;
  quantity: number;
  photoIds: string[];
}

export interface CreateOrderPayload {
  email?: string;
  phone: string;
  billingAddress: OrderAddressInput;
  deliveryAddress?: OrderAddressInput;
  customerNotes?: string;
  items: CreateOrderItemInput[];
}

export interface CreateOrderFromCartPayload {
  sessionId: string;
  email?: string;
  phone?: string;
  billingAddress: OrderAddressInput;
  deliveryAddress?: OrderAddressInput;
  customerNotes?: string;
}


export interface PriceListFormatSize {
  title: string;
}

export interface PriceListFormatPackage {
  id?: string;
  title?: string;
  maxQuantity?: number;
  kind?: string;
  size?: PriceListFormatSize;
}

export interface PriceListFormatPrice {
  id?: string;
  price: string;
  fromQuantity?: number;
  isDefault?: boolean;
}

export interface PriceListFormatItem {
  id: string;
  kind?: "PixelFotoExpress" | "OwnFormat";
  type: "FORMAT" | "PACKAGE";
  title: string;
  prices?: PriceListFormatPrice[];
  size?: PriceListFormatSize;
  packages?: PriceListFormatPackage[];
  sizeId?: string;
  description?: string;
  categoryId?: string;
  oneOffCost?: string;
  shippingCost?: string;
  shippingCostMode?: string;
  isPhotoDownloadable?: boolean;
  userId?: number;
}

export interface PriceList {
  id: string;
  title: string;
  format: PriceListFormatItem[];
  isDefault?: boolean;
}

export interface PriceListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PriceList;
}

export interface OrderCreatedData {
  id: number;
  slug: string;
  totalPrice: string;
  subtotalPrice?: string;
  itemsSnapshot?: unknown[];
  billingAddress?: OrderAddressInput;
}

export interface CreateOrderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: OrderCreatedData;
}

export interface InvoiceMedia {
  id: string;
  url: string;
  bytes?: string;
  height?: number | null;
  width?: number | null;
  mimeType: string;
  metadata?: {
    originalName?: string;
  };
  type?: string;
}

export interface InvoiceOrderInfo {
  id: number;
  slug: string;
}

export interface InvoiceData {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  tenantId: string;
  jobId?: string | null;
  orderId: number;
  mediaId: string;
  paymentMethod: string;
  number: string;
  currency: string;
  totalPrice: string;
  issuedAt: string;
  dueAt: string;
  media?: InvoiceMedia;
  order?: InvoiceOrderInfo;
}

export interface InvoiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  traceId?: string;
  data: InvoiceData;
}
