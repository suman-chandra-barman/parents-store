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

export type ViewMode = "grid" | "masonry";
