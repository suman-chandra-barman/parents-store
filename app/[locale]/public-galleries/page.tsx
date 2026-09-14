import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PublicGalleriesContent } from "@/features/public-galleries/components/PublicGalleriesContent";

export default function PublicGalleriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-brand animate-spin" />
        </div>
      }
    >
      <PublicGalleriesContent />
    </Suspense>
  );
}