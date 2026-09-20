import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PublicGalleriesContent } from "@/features/public-galleries/components/PublicGalleriesContent";

export default async function ClassicPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>;
}) {
  const { jobId } = await searchParams;

  // If jobId is not present in query params, render 404 Not Found
  if (!jobId || !jobId.trim()) {
    notFound();
  }

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
