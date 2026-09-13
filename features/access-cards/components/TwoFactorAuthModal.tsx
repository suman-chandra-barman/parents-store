"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, X, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessCode: string;
  onVerify: (twoFactorPassword: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function TwoFactorAuthModal({
  isOpen,
  onClose,
  accessCode,
  onVerify,
  isLoading = false,
}: TwoFactorAuthModalProps) {
  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorPassword.trim()) {
      setError("Please enter your 2FA security password.");
      return;
    }

    setError(null);
    try {
      const isSuccess = await onVerify(twoFactorPassword.trim());
      if (!isSuccess) {
        setError("Invalid 2FA password. Please check and try again.");
      }
    } catch {
      setError("Failed to verify 2FA password. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-neutral-50 px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#2060b0]/10 border border-[#2060b0]/20 flex items-center justify-center text-[#2060b0]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                Two-Factor Security
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Access Card: <span className="font-semibold text-neutral-700">{accessCode}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="size-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-xs text-neutral-600 leading-relaxed">
            This photo gallery is protected with Two-Factor Authentication. Please enter the additional security password provided with your card.
          </p>

          <div className="space-y-1.5">
            <label
              htmlFor="2fa-password-input"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-600"
            >
              2FA Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="size-4" />
              </div>
              <input
                id="2fa-password-input"
                type={showPassword ? "text" : "password"}
                autoFocus
                value={twoFactorPassword}
                onChange={(e) => {
                  setTwoFactorPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
                placeholder="Enter 2FA password"
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2060b0]/20 focus:border-[#2060b0] transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 pt-1">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="h-10 px-4 text-xs font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !twoFactorPassword.trim()}
              className="h-10 px-5 text-xs font-semibold tracking-wider rounded-xl bg-[#2060b0] hover:bg-[#1a4f94] text-white flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Unlock Gallery</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
