import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PackagesContent } from "@/features/paper-formats/components/PackagesContent";

export default function PackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-brand animate-spin" />
        </div>
      }
    >
      <PackagesContent />
    </Suspense>
  );
}