import React from "react";
import { ImageOff, RefreshCw } from "lucide-react";

interface PhotoCardErrorFallbackProps {
  onRetry: () => void;
  message?: string;
}

export function PhotoCardErrorFallback({
  onRetry,
  message = "Failed to load preview",
}: PhotoCardErrorFallbackProps) {
  return (
    <div className="w-full aspect-4/3 bg-destructive/5 flex flex-col items-center justify-center p-4 text-center">
      <ImageOff className="size-6 text-destructive mb-2" />
      <span className="text-xs text-destructive font-medium">{message}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRetry();
        }}
        className="mt-2 text-xs flex items-center gap-1 text-brand underline font-medium cursor-pointer"
      >
        <RefreshCw className="size-3" /> Retry
      </button>
    </div>
  );
}
