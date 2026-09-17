import { PhotoItem } from "@/features/access-cards/types/access-cards";

export interface FavoritePhotoItem extends PhotoItem {
  favoritedAt?: string;
}

export interface FavoriteGridProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem, index: number) => void;
  onUnfavorite: (photoId: string) => void;
}
