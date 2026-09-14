import React from "react";
import { useTranslations } from "next-intl";
import { Images } from "lucide-react";

export function PublicPhotoEmptyState() {
  const t = useTranslations("PublicGalleries");

  return (
    <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs max-w-md mx-auto space-y-4">
      <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
        <Images className="size-8 stroke-[1.5]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-neutral-800">
          {t("noPhotosFound")}
        </h3>
        <p className="text-xs text-neutral-500">
          {t("noPhotosDesc")}
        </p>
      </div>
    </div>
  );
}
