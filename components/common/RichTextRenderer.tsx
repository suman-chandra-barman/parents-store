"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { sanitizeRichText } from "@/utils/sanitizeHtml";

export interface RichTextRendererProps {
  content?: string | null;
  className?: string;
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | "none";
  expandable?: boolean;
  expandText?: string;
  collapseText?: string;
  truncateLengthThreshold?: number;
}

const LINE_CLAMP_CLASSES: Record<number | "none", string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
  none: "",
};

export function RichTextRenderer({
  content,
  className,
  lineClamp = "none",
  expandable = false,
  expandText = "Read more",
  collapseText = "Show less",
  truncateLengthThreshold = 100,
}: RichTextRendererProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const sanitizedContent = useMemo(() => {
    return sanitizeRichText(content);
  }, [content]);

  if (!sanitizedContent) {
    return null;
  }

  const shouldShowToggle =
    expandable &&
    Boolean(content && content.length > truncateLengthThreshold);

  return (
    <div className={cn("space-y-1", className)}>
      <div
        className={cn(
          "text-xs leading-relaxed text-neutral-600 dark:text-neutral-300",
          "prose prose-xs max-w-none dark:prose-invert",
          "[&_p]:mb-1.5 [&_p:last-child]:mb-0",
          "[&_strong]:font-semibold [&_strong]:text-neutral-800 dark:[&_strong]:text-neutral-100",
          "[&_em]:italic",
          "[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1 [&_ul]:space-y-0.5",
          "[&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1 [&_ol]:space-y-0.5",
          "[&_li]:text-inherit",
          "[&_a]:text-brand [&_a]:underline [&_a:hover]:opacity-80",
          isExpanded
            ? "max-h-56 overflow-y-auto pr-1"
            : lineClamp !== "none"
              ? LINE_CLAMP_CLASSES[lineClamp]
              : "",
        )}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {shouldShowToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className="text-[11px] font-semibold text-brand hover:underline cursor-pointer inline-flex items-center gap-0.5"
        >
          <span>{isExpanded ? collapseText : expandText}</span>
        </button>
      )}
    </div>
  );
}
