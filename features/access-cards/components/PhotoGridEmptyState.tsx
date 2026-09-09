"use client";

import React from "react";
import { Images } from "lucide-react";
import { useTranslations } from "next-intl";

interface PhotoGridEmptyStateProps {
  title?: string;
  description?: string;
}

export function PhotoGridEmptyState({
  title,
  description,
}: PhotoGridEmptyStateProps) {
  const t = useTranslations("PhotoGridEmpty");
  const displayTitle = title ?? t("title");
  const displayDescription = description ?? t("description");

  return (
    <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-2xl border border-border/50 shadow-xs">
      <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
        <Images className="size-6" />
      </div>
      <h4 className="text-sm font-semibold text-foreground">{displayTitle}</h4>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        {displayDescription}
      </p>
    </div>
  );
}
