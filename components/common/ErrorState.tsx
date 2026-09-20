"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  variant?: "page" | "card" | "compact";
  title?: string;
  message?: string;
  rawError?: string | null;
  onRetry?: () => void;
  retryText?: string;
  secondaryAction?: React.ReactNode;
  backHomeHref?: string;
  backHomeText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  variant = "card",
  title = "Unable to Load Data",
  message = "Something went wrong while fetching the data. Please check your connection and try again.",
  rawError,
  onRetry,
  retryText = "Try Again",
  secondaryAction,
  backHomeHref,
  backHomeText = "Back to Home",
  icon,
  className,
}: ErrorStateProps) {
  const isPage = variant === "page";

  const content = (
    <div
      role="alert"
      className={cn(
        "w-full text-center bg-white rounded-3xl border border-red-200/80 shadow-xs max-w-md mx-auto py-12 sm:py-14 px-6 sm:px-8 space-y-4 animate-in fade-in zoom-in-95 duration-200",
        className,
      )}
    >
      {/* Icon Badge */}
      <div className="size-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-500 shadow-2xs">
        {icon || <AlertTriangle className="size-7 stroke-[1.75] text-red-500" />}
      </div>

      {/* Heading & Details */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          {title}
        </h2>

        {message && (
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
            {message}
          </p>
        )}

        {rawError && (
          <div className="pt-1">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-red-50/80 border border-red-100 text-[11px] font-mono text-red-700 max-w-xs truncate">
              {rawError}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {(onRetry || secondaryAction || backHomeHref) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand hover:opacity-90 active:scale-98 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>{retryText}</span>
            </button>
          )}

          {secondaryAction}

          {backHomeHref && !secondaryAction && (
            <Link
              href={backHomeHref}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 active:scale-98 transition-all cursor-pointer"
            >
              <Home className="size-3.5" />
              <span>{backHomeText}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );

  if (isPage) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-neutral-50/50">
        {content}
      </main>
    );
  }

  return content;
}
