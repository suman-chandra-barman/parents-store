"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export function CartEmptyState() {
  const t = useTranslations("Cart");

  return (
    <EmptyState
      icon={<ShoppingBag className="size-7 stroke-[1.5] text-neutral-400" />}
      title={t("emptyTitle")}
      description={t("emptyDesc")}
    />
  );
}
