"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export function FavoritesEmptyState() {
  const t = useTranslations("Favorites");

  return (
    <EmptyState
      icon={<Heart className="size-7 stroke-[1.5] text-neutral-400" />}
      title={t("emptyTitle")}
      description={t("emptyDesc")}
    />
  );
}
