import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PhotoDetailsView } from "@/features/access-cards/components/PhotoDetailsView";

interface FavoritePhotoDetailsPageProps {
  params: Promise<{
    locale: string;
    photoId: string;
  }>;
}

export default async function FavoritePhotoDetailsPage({
  params,
}: FavoritePhotoDetailsPageProps) {
  const { locale, photoId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-brand animate-spin" />
        </div>
      }
    >
      <PhotoDetailsView
        photoId={photoId}
        backUrl={`/${locale}/favorites`}
        backLabel="Back to Favorites"
      />
    </Suspense>
  );
}
