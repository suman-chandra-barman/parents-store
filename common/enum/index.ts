export const JobKind = {
  CLASSIC: 'CLASSIC',
  ACCESS_CARD: 'ACCESS_CARD',
} as const;

export type JobKind = keyof typeof JobKind;

//////////////////////////////////////////////////

export const JobAccessType = {
  PUBLIC: 'PUBLIC',
  PASSWORD: 'PASSWORD',
} as const;

export type JobAccessType = keyof typeof JobAccessType;

////////////////////////////////////////////////////

export const JobVisibility = {
  ACTIVE: 'ACTIVE',
  IN_PREPARATION: 'IN_PREPARATION',
  LOCKED: 'LOCKED',
} as const;

export type JobVisibility = keyof typeof JobVisibility;

//////////////////////////////////////////////////////////

export const EmailShippingPeriod = {
  IN_THE_MORNING: 'IN_THE_MORNING',
  IN_THE_EVENING: 'IN_THE_EVENING',
} as const;

export type EmailShippingPeriod = keyof typeof EmailShippingPeriod;

////////////////////////////////////////////////////////////////

export const EmailRecipientType = {
  ALL: 'ALL',
  WITH_ORDER: 'WITH_ORDER',
  WITHOUT_ORDER: 'WITHOUT_ORDER',
} as const;

export type EmailRecipientType = keyof typeof EmailRecipientType;

////////////////////////////////////////////////////////////////

export const EmailTriggerType = {
  PHOTO_DAY: 'PHOTO_DAY',
  ACCESS_SENT: 'ACCESS_SENT',
  AFTER_ORDER: 'AFTER_ORDER',
  BLOCKING_THE_CLIENT: 'BLOCKING_THE_CLIENT',
  AFTER_UNPAID_ORDER: 'AFTER_UNPAID_ORDER',
  PROMOTIONAL_VOUCHER_EXPIRES: 'PROMOTIONAL_VOUCHER_EXPIRES',
} as const;

export type EmailTriggerType = keyof typeof EmailTriggerType;

/////////////////////////////////////////////////////

export const JobAccessProcedure = {
  CLASSIC: 'CLASSIC',
  PRE_REGISTRATION: 'PRE_REGISTRATION',
  CONTACT_SHEETS: 'CONTACT_SHEETS',
} as const;

export type JobAccessProcedure = keyof typeof JobAccessProcedure;

/////////////////////////////////////////////////////

export const AccessCardPaperFormat = {
  BUSINESS_CARD_10X: 'BUSINESS_CARD_10X',
  DIN_A6_4X: 'DIN_A6_4X',
  DIN_A4: 'DIN_A4',
  DIN_A4_WITH_FORM: 'DIN_A4_WITH_FORM',
};

export type AccessCardPaperFormat = keyof typeof AccessCardPaperFormat;

////////////////////////////////////////////////////////

export const TextTemplateKind = {
  TEXT_TEMPLATE: 'TEXT_TEMPLATE',
  EMAIL_TEMPLATE: 'EMAIL_TEMPLATE',
  PAYMENT_REMINDER: 'PAYMENT_REMINDER',
  TRANSFER_TO_LAB: 'TRANSFER_TO_LAB',
  PHOTO_READY_TO_COLLECT: 'PHOTO_READY_TO_COLLECT',
  SHIPPING_INFO: 'SHIPPING_INFO',
} as const;

export type TextTemplateKind = keyof typeof TextTemplateKind;

////////////////////////////////////////////////////////

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
  PHOTOGRAPHER: 'PHOTOGRAPHER',
} as const;

export type UserRole = keyof typeof UserRole;

////////////////////////////////////////////////////////

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;

export type UserStatus = keyof typeof UserStatus;

////////////////////////////////////////////////////////

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NOT_SPECIFIED: 'NOT_SPECIFIED',
} as const;

export type Gender = keyof typeof Gender;

////////////////////////////////////////////////////////

export const WatermarkType = {
  TEXT: 'TEXT',
  LOGO: 'LOGO',
} as const;

export type WatermarkType = keyof typeof WatermarkType;

////////////////////////////////////////////////////////

export const WatermarkPattern = {
  NONE: 'NONE',
  GRID: 'GRID',
  CIRCLES: 'CIRCLES',
  POINT: 'POINT',
  CURLS: 'CURLS',
  LINES: 'LINES',
} as const;

export type WatermarkPattern = keyof typeof WatermarkPattern;

///////////////////////////////////////////////////

export const FontFamily = {
  // Serif fonts - elegant and classic
  'Playfair Display': 'Playfair Display',
  Lora: 'Lora',
  Merriweather: 'Merriweather',

  // Sans-serif fonts - clean and modern
  Inter: 'Inter',
  Montserrat: 'Montserrat',
  'Open Sans': 'Open Sans',
  Raleway: 'Raleway',

  // Script/handwriting - personal and artistic
  'Dancing Script': 'Dancing Script',
  'Great Vibes': 'Great Vibes',

  // Display - bold and impactful
  Oswald: 'Oswald',
} as const;

export type FontFamily = keyof typeof FontFamily;

////////////////////////////////////////////////////////////

export const PaperFormatKind = {
  PixelFotoExpress: 'PixelFotoExpress',
  OwnFormat: 'OwnFormat',
} as const;

export type PaperFormatKind = keyof typeof PaperFormatKind;

//////////////////////////////////////////////////////////////

export const PaperFormatType = {
  FORMAT: 'FORMAT',
  PACKAGE: 'PACKAGE',
} as const;

export type PaperFormatType = keyof typeof PaperFormatType;

//////////////////////////////////////////////////////////////

export const PaperFormatShippingCostMode = {
  ONCE_PER_ORDER: 'ONCE_PER_ORDER',
  EACH_PHOTO: 'EACH_PHOTO',
};

export type PaperFormatShippingCostMode =
  keyof typeof PaperFormatShippingCostMode;

////////////////////////////////////////////////////////////

export const PaperFormatPackageKind = {
  ALL: 'ALL',
  SINGLE_PHOTO: 'SINGLE_PHOTO',
  GROUP_PHOTO: 'GROUP_PHOTO',
} as const;

export type PaperFormatPackageKind = keyof typeof PaperFormatPackageKind;

////////////////////////////////////////////////////////////

export const GiftVoucherLayout = {
  NEUTRAL: 'NEUTRAL',
  HEART: 'HEART',
  GIFT: 'GIFT',
  CHRISTMAS: 'CHRISTMAS',
  CAMERA: 'CAMERA',
} as const;

export type GiftVoucherLayout = keyof typeof GiftVoucherLayout;

////////////////////////////////////////////////////////////

export const OrderItemKind = {
  PHOTO: 'PHOTO',
  GIFT_VOUCHER: 'GIFT_VOUCHER',
  PRODUCT: 'PRODUCT',
} as const;

export type OrderItemKind = keyof typeof OrderItemKind;

////////////////////////////////////////////////////////////

export const TenantPlan = {
  FREE: 'FREE',
  BYPASS: 'BYPASS',
} as const;

export type TenantPlan = keyof typeof TenantPlan;

////////////////////////////////////////////////////////////

export const TenantStatus = {
  ACTIVE: 'ACTIVE',
  TRIAL: 'TRIAL',
  PAST_DUE: 'PAST_DUE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type TenantStatus = keyof typeof TenantStatus;

////////////////////////////////////////////////////////////

export const TenantMemberRole = {
  OWNER: 'OWNER',
} as const;

export type TenantMemberRole = keyof typeof TenantMemberRole;

////////////////////////////////////////////////////////////

export const TranslationLanguage = {
  en: 'en',
  de: 'de',
} as const;

export type TranslationLanguage = keyof typeof TranslationLanguage;

////////////////////////////////////////////////////////////

export const AccessCardSource = {
  PRE_REGISTRATION: 'PRE_REGISTRATION',
  AUTOMATED: 'AUTOMATED',
  DIRECT_ENTRY: 'DIRECT_ENTRY',
} as const;

export type AccessCardSource = keyof typeof AccessCardSource;
