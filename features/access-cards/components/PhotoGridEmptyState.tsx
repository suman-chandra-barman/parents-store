"use client";

import React from "react";
import { Images } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/common/EmptyState";

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
    <EmptyState
      icon={<Images className="size-8 stroke-[1.5]" />}
      title={displayTitle}
      description={displayDescription}
    />
  );
}
