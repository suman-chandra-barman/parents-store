import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { GiftVouchersContent } from "@/features/gift-vouchers/components/GiftVouchersContent";

export default function GiftVoucherPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-brand animate-spin" />
        </div>
      }
    >
      <GiftVouchersContent />
    </Suspense>
  );
}