"use client";

import React from "react";
import Link from "next/link";
import { useTenantStore } from "@/stores/useTenantStore";

export function Footer() {
  const tenant = useTenantStore((state) => state.tenant);
  const brandName = tenant?.name || "Sunnyside Portraits";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FAF9F5] border-t border-neutral-200/60 py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
        <div>
          © {currentYear} {brandName}. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-neutral-500 font-medium">
          <Link
            href="#"
            className="hover:text-neutral-900 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="hover:text-neutral-900 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="hover:text-neutral-900 transition-colors"
          >
            Parent Helpdesk
          </Link>
        </div>
      </div>
    </footer>
  );
}
