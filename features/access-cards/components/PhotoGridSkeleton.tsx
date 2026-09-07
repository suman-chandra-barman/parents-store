import React from "react";
import { Layers } from "lucide-react";

interface PhotoGridSkeletonProps {
  count?: number;
}

export function PhotoGridSkeleton({ count = 10 }: PhotoGridSkeletonProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="w-full aspect-4/3 rounded-xs bg-muted/60 animate-pulse border border-border/30 flex flex-col items-center justify-center gap-2 break-inside-avoid mb-2"
        >
          <Layers className="size-7 text-brand/30 animate-bounce" />
          <span className="text-xs text-muted-foreground font-mono">
            Loading photos...
          </span>
        </div>
      ))}
    </div>
  );
}
