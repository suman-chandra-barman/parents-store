import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutContent } from "@/features/orders/components/CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-[#2060b0] animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
