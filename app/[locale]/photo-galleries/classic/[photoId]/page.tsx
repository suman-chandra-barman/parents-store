import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PhotoDetailsView } from "@/features/access-cards/components/PhotoDetailsView";

interface ClassicPhotoDetailsPageProps {
  params: Promise<{
    locale: string;
    photoId: string;
  }>;
}

export default async function ClassicPhotoDetailsPage({
  params,
}: ClassicPhotoDetailsPageProps) {
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
        backUrl={`/${locale}/photo-galleries/classic`}
        backLabel="Back to Classic Gallery"
      />
    </Suspense>
  );
}
