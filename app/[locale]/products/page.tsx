import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProductsContent } from "@/features/products/components/ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-[#2060b0] animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}