"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, usePathname } from "next/navigation";
import { Images, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/stores/useTenantStore";

const jobSchema = z.object({
  jobId: z
    .string()
    .min(1, "Job ID is required")
    .trim(),
});

type JobFormData = z.infer<typeof jobSchema>;

export function PublicGalleryJobPrompt() {
  const router = useRouter();
  const pathname = usePathname();
  const tenant = useTenantStore((state) => state.tenant);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobId: "",
    },
  });

  const onSubmit = (data: JobFormData) => {
    // If user pasted a full URL containing jobId, extract it
    let cleanJobId = data.jobId.trim();
    if (cleanJobId.includes("jobId=")) {
      try {
        const parsed = new URL(cleanJobId);
        cleanJobId = parsed.searchParams.get("jobId") || cleanJobId;
      } catch {
        const match = cleanJobId.match(/jobId=([^&]+)/);
        if (match) cleanJobId = match[1];
      }
    }

    router.push(`${pathname}?jobId=${encodeURIComponent(cleanJobId)}`);
  };

  return (
    <div className="min-h-[calc(100vh-66px)] flex items-center justify-center px-4 py-12 bg-neutral-50/60">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-10 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="size-16 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center mx-auto text-[#2060b0] shadow-xs">
          <Images className="size-8 stroke-[1.8]" />
        </div>

        <div className="text-center space-y-2">
          <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            {tenant?.name || "LUMIPHOTO"}
          </span>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            View Photo Gallery
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Please enter the Job ID from your invitation email or click the link sent to your inbox to view your gallery.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label
              htmlFor="job-id-input"
              className="text-xs font-semibold text-neutral-700"
            >
              Gallery Job ID / Link
            </label>
            <input
              id="job-id-input"
              type="text"
              placeholder="e.g. bcd145f5-d86c-4eda-9550-09668fb32e75"
              {...register("jobId")}
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
            {errors.jobId && (
              <p className="text-xs font-medium text-red-500 pt-0.5">
                {errors.jobId.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-brand hover:opacity-85 text-xs font-semibold tracking-wider text-white transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>CONTINUE TO GALLERY</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
