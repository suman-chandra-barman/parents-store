"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/stores/useTenantStore";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PublicGalleryPasswordPromptProps {
  isLoading: boolean;
  error?: string | null;
  onSubmitPassword: (password: string) => void;
}

export function PublicGalleryPasswordPrompt({
  isLoading,
  error,
  onSubmitPassword,
}: PublicGalleryPasswordPromptProps) {
  const tenant = useTenantStore((state) => state.tenant);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onFormSubmit = (data: PasswordFormData) => {
    onSubmitPassword(data.password);
  };

  return (
    <div className="min-h-[calc(100vh-66px)] flex items-center justify-center px-4 py-12 bg-neutral-50/60">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-10 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="size-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
          <Lock className="size-8 stroke-[1.8]" />
        </div>

        {/* Title and Description */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            {tenant?.name || "LUMIPHOTO"}
          </span>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Password Protected Gallery
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            This photo gallery requires an access password. Please enter the password provided in your email invitation.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label
              htmlFor="gallery-password"
              className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5"
            >
              <KeyRound className="size-3.5 text-neutral-500" />
              <span>Gallery Password</span>
            </label>

            <div className="relative">
              <input
                id="gallery-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                disabled={isLoading}
                {...register("password")}
                className="w-full h-12 px-4 pr-11 rounded-xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs font-medium text-red-500 pt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600 animate-in fade-in duration-150">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-brand hover:opacity-85 text-xs font-semibold tracking-wider text-white transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>VERIFYING PASSWORD...</span>
              </>
            ) : (
              <span>UNLOCK GALLERY</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
