export interface AlbumInfo {
  name: string;
  individualPriceListId?: string;
  groupPriceListId?: string;
}

export interface AccessCardInfo {
  password?: string;
}

export interface PhotoItem {
  id: string;
  rotationAngle?: number;
  albumId?: string;
  album?: AlbumInfo;
  folderId?: string;
}

export interface FolderItem {
  id: string;
  albumId: string;
  album: AlbumInfo;
  accessCard?: AccessCardInfo;
  photos: PhotoItem[];
}

export interface ApiPreviewMeta {
  schema?: string;
  url?: string;
  params?: {
    photoId?: string;
  };
}

export interface AccessCardsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    preview?: ApiPreviewMeta;
  };
  data?: {
    folders?: FolderItem[];
    uncategorized?: PhotoItem[];
  };
}

export interface AlbumSampleMediaMetadata {
  originalName?: string;
  [key: string]: unknown;
}

export interface AlbumSampleMedia {
  id: string;
  url: string;
  bytes?: string | number;
  height?: number;
  width?: number;
  mimeType?: string;
  metadata?: AlbumSampleMediaMetadata;
  type?: string;
}

export interface StatusAlbum {
  name: string;
  sample?: AlbumSampleMedia;
}

export interface TwoFactorStatusData {
  isTwoFactorProtected: boolean;
  albums?: StatusAlbum[];
}

export interface TwoFactorStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  traceId?: string;
  data: TwoFactorStatusData;
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  traceId?: string;
  data: {
    isMatch: boolean;
  };
}

export type ViewMode = "grid" | "masonry";
