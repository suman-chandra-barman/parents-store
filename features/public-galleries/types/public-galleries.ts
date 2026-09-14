import type {
  PhotoItem,
  AlbumInfo,
} from "@/features/access-cards/types/access-cards";

export type { PhotoItem, AlbumInfo };

export interface ClassicAlbumPhoto {
  id: string;
  rotationAngle?: number;
}

export interface ClassicAlbum {
  id: string;
  name: string;
  individualPriceListId?: string | null;
  groupPriceListId?: string | null;
  photos: ClassicAlbumPhoto[];
}

export interface ClassicPasswordStatusResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    isPasswordRequired: boolean;
  };
}

export interface ClassicGalleryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    preview?: {
      schema?: string;
      url?: string;
      params?: {
        photoId?: string;
      };
    };
  };
  data?: {
    albums?: ClassicAlbum[];
  };
}
