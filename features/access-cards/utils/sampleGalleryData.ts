import { PhotoItem } from "../types/access-cards";

export interface ChildGalleryProfile {
  name: string;
  avatarUrl: string;
  dotColor: string;
  count: number;
}

export const SAMPLE_CHILDREN: Record<string, ChildGalleryProfile> = {
  Emma: {
    name: "Emma",
    avatarUrl:
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=120&q=80",
    dotColor: "#FF5A36",
    count: 8,
  },
  Noah: {
    name: "Noah",
    avatarUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80",
    dotColor: "#10B981",
    count: 6,
  },
};

export const SAMPLE_GALLERY_PHOTOS: (PhotoItem & {
  childName: "Emma" | "Noah";
  previewUrl: string;
})[] = [
  // Emma's photos
  {
    id: "emma-photo-1",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emma-photo-2",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emma-photo-3",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emma-photo-4",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emma-photo-5",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emma-photo-6",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1491013516836-7db643ee125a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emma-photo-7",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emma-photo-8",
    childName: "Emma",
    album: { name: "Emma" },
    previewUrl:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
  },

  // Noah's photos
  {
    id: "noah-photo-1",
    childName: "Noah",
    album: { name: "Noah" },
    previewUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "noah-photo-2",
    childName: "Noah",
    album: { name: "Noah" },
    previewUrl:
      "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "noah-photo-3",
    childName: "Noah",
    album: { name: "Noah" },
    previewUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "noah-photo-4",
    childName: "Noah",
    album: { name: "Noah" },
    previewUrl:
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "noah-photo-5",
    childName: "Noah",
    album: { name: "Noah" },
    previewUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "noah-photo-6",
    childName: "Noah",
    album: { name: "Noah" },
    previewUrl:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
  },
];
