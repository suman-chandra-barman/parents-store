"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Gift Voucher", href: "/gift-voucher" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/photo-galleries");
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center justify-center py-2">
            <span className="font-bold text-lg tracking-tight text-brand">
              Lumiphoto
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-5 py-2 rounded-lg text-xs font-semibold transition-all",
                  active
                    ? "bg-[#2060b0] text-white shadow-sm hover:bg-[#1a4f94]"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-5">
          {/* Language Switcher */}

          {/* Favorites */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors"
          >
            <Heart className="size-4 stroke-[1.8]" />
            <span>Favorites</span>
          </button>

          {/* Shopping Cart */}
          <button
            type="button"
            className="relative p-1 text-neutral-700 hover:text-neutral-900 cursor-pointer transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="size-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Mobile: Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            className="relative p-1 text-neutral-700 hover:text-neutral-900"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-600 hover:text-neutral-900"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors",
                    active
                      ? "bg-[#2060b0] text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-600">
            <button type="button" className="flex items-center gap-1.5 hover:text-neutral-900">
              <Heart className="size-4" />
              <span>Favorites</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
