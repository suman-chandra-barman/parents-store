"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-16 sm:py-20 px-6 text-center bg-white rounded-3xl border border-neutral-200/80 shadow-xs max-w-md mx-auto space-y-4 animate-in fade-in duration-200",
        className,
      )}
    >
      <div className="size-16 rounded-2xl bg-neutral-100/90 text-neutral-400 flex items-center justify-center mx-auto shadow-2xs">
        {icon || <FolderOpen className="size-8 stroke-[1.5]" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-neutral-800 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
