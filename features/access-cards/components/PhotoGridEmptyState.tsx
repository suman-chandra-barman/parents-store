import React from "react";
import { Images } from "lucide-react";

interface PhotoGridEmptyStateProps {
  title?: string;
  description?: string;
}

export function PhotoGridEmptyState({
  title = "No photos found",
  description = "There are no photos available in this gallery.",
}: PhotoGridEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-2xl border border-border/50 shadow-xs">
      <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
        <Images className="size-6" />
      </div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        {description}
      </p>
    </div>
  );
}
