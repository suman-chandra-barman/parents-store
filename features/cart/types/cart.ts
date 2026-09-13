export type CartItemKind = "PHOTO" | "GIFT_VOUCHER" | "PRODUCT";

export interface AddPhotoCartItemPayload {
  kind: "PHOTO";
  formatId: string;
  quantity: number;
  photoIds: string[];
}

export interface AddGiftVoucherCartItemPayload {
  kind: "GIFT_VOUCHER";
  voucherId: string;
  quantity: number;
  layoutId?: string;
  message?: string;
  hideValue?: boolean;
  sendAt?: string;
}

export interface AddProductCartItemPayload {
  kind: "PRODUCT";
  productId: string;
  quantity: number;
}

export type AddCartItemPayload =
  | AddPhotoCartItemPayload
  | AddGiftVoucherCartItemPayload
  | AddProductCartItemPayload;

export interface CartPhotoMedia {
  id: string;
  url: string;
  bytes?: string;
  height?: number;
  width?: number;
  mimeType?: string;
  type?: string;
}

export interface CartPhotoItem {
  id: string;
  rotationAngle?: number;
  isQrPhoto?: boolean;
  order?: number;
  folderId?: string;
  albumId?: string;
  mediaId?: string;
  media?: CartPhotoMedia;
}

export interface CartFormatInfo {
  id: string;
  kind?: string;
  type?: string;
  sizeId?: string;
  title: string;
  description?: string;
  categoryId?: string;
  oneOffCost?: string;
  shippingCost?: string;
  shippingCostMode?: string;
  isPhotoDownloadable?: boolean;
}

export interface CartItem {
  id: number | string;
  cartId: string;
  kind: CartItemKind;
  title: string | null;
  formatId?: string;
  voucherId?: string;
  productId?: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  layoutId?: string | null;
  message?: string | null;
  hideValue?: boolean | null;
  sendAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  format?: CartFormatInfo | null;
  photos?: CartPhotoItem[];
}

export interface PriceBreakdownItem {
  itemKind: string;
  title: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  formatId?: string;
  formatTitle?: string;
  formatKind?: string;
  formatType?: string;
  photoIds?: string[];
}

export interface PriceBreakdown {
  items: PriceBreakdownItem[];
  subtotalPrice: string;
  shippingPrice: string;
  discount?: {
    giftVoucherCode?: string | null;
    discountPrice?: string;
  };
  totalPrice: string;
}

export interface GiftVoucherCodeInfo {
  code: string;
  priceSubTotal?: string;
  priceTotal?: string;
  value?: string;
  voucherId?: string;
  userId?: number;
  purchaseId?: string;
  orderId?: string | null;
  isActive?: boolean;
  isRedeemed?: boolean;
  createdAt?: string;
}

export interface CartData {
  id: string;
  sessionId: string;
  email?: string | null;
  subtotalPrice: string;
  totalPrice: string;
  discountPrice?: string;
  giftVoucherCodeId?: string | null;
  giftVoucherCode?: GiftVoucherCodeInfo | null;
  priceBreakdown?: PriceBreakdown;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
  items: CartItem[];
  shippingPrice?: string;
}

export interface CartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CartData;
}
