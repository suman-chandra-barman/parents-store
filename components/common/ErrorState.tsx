"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Failed to load data. Please check your connection and try again.",
  onRetry,
  retryText = "Retry",
  icon,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "py-16 px-6 sm:px-10 text-center bg-white rounded-3xl border border-rose-100 shadow-xs max-w-lg mx-auto space-y-4 animate-in fade-in duration-200",
        className,
      )}
    >
      <div className="size-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-2xs">
        {icon || <AlertCircle className="size-7 stroke-[1.75]" />}
      </div>

      <div className="space-y-1">
        {title && (
          <h3 className="text-base font-bold text-neutral-900 tracking-tight">
            {title}
          </h3>
        )}
        {message && (
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        )}
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer active:scale-95"
        >
          <RefreshCw className="size-3.5" />
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
}
