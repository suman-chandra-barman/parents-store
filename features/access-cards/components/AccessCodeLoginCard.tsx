"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
  Trash2,
  User,
} from "lucide-react";
import { useLazyCheckTwoFactorStatusQuery } from "../api/accessCardsApi";
import type { StatusAlbum } from "../types/access-cards";
import { parseErrorMessage } from "@/utils/parseErrorMessage";

export interface AccessCodeLoginCardProps {
  initialCode?: string;
  isLoading?: boolean;
  error?: string | null;
  onSubmit: (codes: string[]) => void;
}

interface SiblingItem {
  id: string;
  code: string;
  albums: StatusAlbum[];
  isChecking: boolean;
  error: string | null;
  hasChecked: boolean;
}

export function AccessCodeLoginCard({
  initialCode = "",
  isLoading = false,
  error = null,
  onSubmit,
}: AccessCodeLoginCardProps) {
  const [triggerCheck2FA] = useLazyCheckTwoFactorStatusQuery();

  const [primaryCode, setPrimaryCode] = useState<string>(initialCode);
  const [primaryAlbums, setPrimaryAlbums] = useState<StatusAlbum[]>([]);
  const [isCheckingPrimary, setIsCheckingPrimary] = useState<boolean>(false);
  const [primaryError, setPrimaryError] = useState<string | null>(null);
  const [hasCheckedPrimary, setHasCheckedPrimary] = useState<boolean>(false);

  const [hasSiblings, setHasSiblings] = useState<boolean>(false);
  const [siblings, setSiblings] = useState<SiblingItem[]>([
    {
      id: "sib-1",
      code: "",
      albums: [],
      isChecking: false,
      error: null,
      hasChecked: false,
    },
  ]);

  const siblingTimersRef = useRef<{ [id: string]: NodeJS.Timeout }>({});

  // Debounced check for primary code
  useEffect(() => {
    const code = primaryCode.trim();
    if (!code) {
      setPrimaryAlbums([]);
      setPrimaryError(null);
      setHasCheckedPrimary(false);
      setIsCheckingPrimary(false);
      return;
    }

    if (code.length < 3) {
      setPrimaryAlbums([]);
      setPrimaryError(null);
      setHasCheckedPrimary(false);
      setIsCheckingPrimary(false);
      return;
    }

    setIsCheckingPrimary(true);
    setPrimaryError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await triggerCheck2FA(code).unwrap();
        if (res?.data?.albums && res.data.albums.length > 0) {
          setPrimaryAlbums(res.data.albums);
        } else {
          setPrimaryAlbums([]);
        }
        setPrimaryError(null);
        setHasCheckedPrimary(true);
      } catch (err: unknown) {
        setPrimaryAlbums([]);
        setPrimaryError(
          parseErrorMessage(
            err,
            "Code not recognized. Please check your child's photo slip."
          )
        );
        setHasCheckedPrimary(true);
      } finally {
        setIsCheckingPrimary(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [primaryCode, triggerCheck2FA]);

  // Handle sibling code change with debounce
  const handleSiblingCodeChange = useCallback(
    (id: string, val: string) => {
      const upperVal = val.toUpperCase();

      setSiblings((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                code: upperVal,
                error: null,
                hasChecked: false,
                isChecking: upperVal.trim().length >= 3,
                albums: [],
              }
            : s
        )
      );

      if (siblingTimersRef.current[id]) {
        clearTimeout(siblingTimersRef.current[id]);
      }

      const trimmed = upperVal.trim();
      if (trimmed.length < 3) {
        setSiblings((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, isChecking: false, albums: [], error: null } : s
          )
        );
        return;
      }

      siblingTimersRef.current[id] = setTimeout(async () => {
        try {
          const res = await triggerCheck2FA(trimmed).unwrap();
          setSiblings((prev) =>
            prev.map((s) =>
              s.id === id
                ? {
                    ...s,
                    isChecking: false,
                    hasChecked: true,
                    albums: res?.data?.albums || [],
                    error: null,
                  }
                : s
            )
          );
        } catch (err: unknown) {
          setSiblings((prev) =>
            prev.map((s) =>
              s.id === id
                ? {
                    ...s,
                    isChecking: false,
                    hasChecked: true,
                    albums: [],
                    error: parseErrorMessage(
                      err,
                      "Code not recognized. Please check your child's photo slip."
                    ),
                  }
                : s
            )
          );
        }
      }, 500);
    },
    [triggerCheck2FA]
  );

  const handleAddSibling = () => {
    setSiblings((prev) => [
      ...prev,
      {
        id: `sib-${Date.now()}`,
        code: "",
        albums: [],
        isChecking: false,
        error: null,
        hasChecked: false,
      },
    ]);
  };

  const handleRemoveSibling = (id: string) => {
    if (siblingTimersRef.current[id]) {
      clearTimeout(siblingTimersRef.current[id]);
    }
    setSiblings((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const primary = primaryCode.trim();
    if (!primary) return;

    const codes = [primary];
    if (hasSiblings) {
      siblings.forEach((s) => {
        const c = s.code.trim();
        if (c && !s.error && !codes.includes(c)) {
          codes.push(c);
        }
      });
    }
    onSubmit(codes);
  };

  const isFormValid =
    Boolean(primaryCode.trim()) && !isCheckingPrimary && !primaryError;

  return (
    <div className="w-full flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-110 bg-white rounded-3xl border border-neutral-200/70 shadow-sm p-6 sm:p-9 space-y-6">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Enter Access Code
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Your code is on your school-provided slip
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Primary Access Code */}
          <div className="space-y-2">
            <label
              htmlFor="primary-code"
              className="block text-xs font-bold text-neutral-700"
            >
              Primary Access Code
            </label>
            <div className="relative">
              <input
                id="primary-code"
                type="text"
                value={primaryCode}
                onChange={(e) => setPrimaryCode(e.target.value.toUpperCase())}
                placeholder="Enter access code"
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold tracking-wider text-neutral-800 placeholder:text-neutral-300 focus:outline-none transition-all pr-10 ${
                  primaryError
                    ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10"
                    : "border-neutral-200 focus:border-[#FF5A36] focus:ring-2 focus:ring-[#FF5A36]/10"
                }`}
              />
              {isCheckingPrimary && (
                <Loader2 className="size-4 animate-spin text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
              {!isCheckingPrimary &&
                hasCheckedPrimary &&
                primaryAlbums.length > 0 && (
                  <CheckCircle2 className="size-5 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                )}
              {!isCheckingPrimary && hasCheckedPrimary && primaryError && (
                <AlertCircle className="size-5 text-rose-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Child Found Badge(s) */}
            {primaryAlbums.length > 0 && (
              <div className="pt-1.5 space-y-1.5 animate-in fade-in duration-200">
                <span className="block text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase">
                  {primaryAlbums.length > 1 ? "CHILDREN FOUND" : "CHILD FOUND"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {primaryAlbums.map((album, idx) => (
                    <div
                      key={`${album.name}-${idx}`}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400 bg-emerald-50/50 text-xs font-bold text-neutral-800 shadow-2xs"
                    >
                      <div className="relative size-5 rounded-full overflow-hidden border border-emerald-300 bg-emerald-100 flex items-center justify-center shrink-0">
                        {album.sample?.url ? (
                          <Image
                            src={album.sample.url}
                            alt={album.name}
                            fill
                            className="object-cover"
                            sizes="20px"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700">
                            {album.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span>{album.name}</span>
                      <CheckCircle2 className="size-3.5 text-emerald-600 ml-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message for Primary Code */}
            {primaryError && (
              <p className="text-[11px] font-medium text-rose-500 leading-tight">
                {primaryError}
              </p>
            )}
          </div>

          {/* Sibling Toggle Box */}
          <div className="rounded-2xl bg-[#F5F2EB]/50 border border-neutral-200/50 p-4 space-y-3.5">
            <p className="text-xs font-bold text-neutral-800 text-center">
              Do you have other children at this facility?
            </p>

            {/* Segmented Switch */}
            <div className="grid grid-cols-2 p-1 rounded-full bg-neutral-200/70 max-w-50 mx-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setHasSiblings(false)}
                className={`py-1.5 rounded-full transition-all cursor-pointer ${
                  !hasSiblings
                    ? "bg-white text-neutral-800 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setHasSiblings(true)}
                className={`py-1.5 rounded-full transition-all cursor-pointer ${
                  hasSiblings
                    ? "bg-white text-[#FF5A36] shadow-xs"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Yes
              </button>
            </div>

            {/* If Sibling is Yes */}
            {hasSiblings && (
              <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                {siblings.map((sibling, index) => (
                  <div key={sibling.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`sibling-code-${sibling.id}`}
                        className="block text-xs font-semibold text-neutral-700"
                      >
                        {index === 0
                          ? "Second Child Code"
                          : `Child #${index + 2} Code`}
                      </label>
                      {siblings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSibling(sibling.id)}
                          className="text-[11px] text-neutral-400 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="size-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id={`sibling-code-${sibling.id}`}
                        type="text"
                        value={sibling.code}
                        onChange={(e) =>
                          handleSiblingCodeChange(sibling.id, e.target.value)
                        }
                        placeholder="Enter access code"
                        className={`w-full rounded-2xl border px-4 py-2.5 text-xs font-semibold tracking-wider text-neutral-800 bg-white placeholder:text-neutral-300 focus:outline-none transition-all pr-10 ${
                          sibling.error
                            ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/10"
                            : "border-neutral-200 focus:border-[#FF5A36]"
                        }`}
                      />
                      {sibling.isChecking && (
                        <Loader2 className="size-4 animate-spin text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      )}
                      {!sibling.isChecking &&
                        sibling.hasChecked &&
                        sibling.albums.length > 0 && (
                          <CheckCircle2 className="size-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                        )}
                      {!sibling.isChecking &&
                        sibling.hasChecked &&
                        sibling.error && (
                          <AlertCircle className="size-4 text-rose-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                        )}
                    </div>

                    {/* Sibling Child Found Badge(s) */}
                    {sibling.albums.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <span className="block text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase">
                          CHILD FOUND
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {sibling.albums.map((album, aIdx) => (
                            <div
                              key={`${album.name}-${aIdx}`}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400 bg-emerald-50/50 text-xs font-bold text-neutral-800 shadow-2xs"
                            >
                              <div className="relative size-5 rounded-full overflow-hidden border border-emerald-300 bg-emerald-100 flex items-center justify-center shrink-0">
                                {album.sample?.url ? (
                                  <Image
                                    src={album.sample.url}
                                    alt={album.name}
                                    fill
                                    className="object-cover"
                                    sizes="20px"
                                  />
                                ) : (
                                  <User className="size-3 text-emerald-700" />
                                )}
                              </div>
                              <span>{album.name}</span>
                              <CheckCircle2 className="size-3.5 text-emerald-600 ml-0.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sibling.error && (
                      <p className="text-[11px] font-medium text-rose-500 leading-tight">
                        {sibling.error}
                      </p>
                    )}
                  </div>
                ))}

                {/* Additional Siblings Button */}
                <button
                  type="button"
                  onClick={handleAddSibling}
                  className="w-full py-2 px-3 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                >
                  <Plus className="size-3.5" />
                  <span>Siblings? Add another code</span>
                </button>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          {/* View Photos Action Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#FF5A36] hover:bg-[#E84A26] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#FF5A36]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Checking Code...</span>
              </>
            ) : (
              <span>View Photos</span>
            )}
          </button>

          {/* Terms Disclaimer */}
          <p className="text-[11px] text-neutral-400 text-center font-medium leading-relaxed">
            By logging in, you agree to our Terms of Service & Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
}

export default AccessCodeLoginCard;
