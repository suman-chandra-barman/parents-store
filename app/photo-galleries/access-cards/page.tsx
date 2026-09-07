import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AccessCardsContent from "@/features/access-cards/components/AccessCardsContent";

export default function AccessCardsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-brand animate-spin" />
        </div>
      }
    >
      <AccessCardsContent />
    </Suspense>
  );
}
