'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useFavorites } from '@/features/access-cards/hooks/useFavorites';
import { useCart } from '@/features/cart/hooks/useCart';
import { LanguageSwitcher } from './LanguageSwitcher';
import Image from 'next/image';
import { useTenantStore } from '@/stores/useTenantStore';

export function Navbar() {
  const { tenant } = useTenantStore();

  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Navbar');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favoriteCount } = useFavorites();
  const { itemCount } = useCart();

  const NAV_LINKS = [
    { label: t('home'), href: `/${locale}` },
    { label: t('products'), href: `/${locale}/products` },
    { label: t('giftVoucher'), href: `/${locale}/gift-voucher` },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}` || href === '/') {
      return (
        pathname === `/${locale}` ||
        pathname === '/' ||
        pathname.startsWith(`/${locale}/photo-galleries`) ||
        pathname.startsWith('/photo-galleries')
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center justify-center py-2">
            {tenant?.logo ? (
              <Image
                src={tenant.logo.url}
                alt={`Logo of ${tenant.name}`}
                width={384}
                height={135}
                className="w-auto h-10 object-contain"
              />
            ) : (
              <span className="font-bold text-lg tracking-tight text-brand">
                {tenant?.name}
              </span>
            )}
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-5 py-2 rounded-lg text-xs font-semibold transition-all',
                  active
                    ? 'bg-brand text-white shadow-sm hover:opacity-70'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Favorites */}
          <Link
            href={`/${locale}/favorites`}
            className={cn(
              "relative flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors p-1.5 rounded-lg",
              pathname.startsWith(`/${locale}/favorites`)
                ? "text-brand bg-brand/10 font-semibold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
            )}
            title={t('favorites')}
            aria-label={t('favorites')}
          >
            <div className="relative flex items-center justify-center">
              <Heart
                className={cn(
                  'size-4 stroke-[1.8] transition-colors',
                  favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : '',
                )}
              />
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center leading-none shadow-xs animate-in zoom-in-50 duration-200">
                  {favoriteCount}
                </span>
              )}
            </div>
          </Link>

          {/* Shopping Cart */}
          <Link
            href={`/${locale}/cart`}
            className={cn(
              "relative p-1.5 cursor-pointer transition-colors rounded-lg",
              pathname.startsWith(`/${locale}/cart`)
                ? "text-brand bg-brand/10 font-semibold"
                : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100",
            )}
            aria-label={t('shoppingCart')}
            title={t('shoppingCart')}
          >
            <ShoppingCart className="size-5 stroke-[1.8]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-brand text-[10px] font-bold text-white flex items-center justify-center leading-none shadow-xs animate-in zoom-in-50 duration-200">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: Hamburger & Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <LanguageSwitcher />

          {/* Favorites (Mobile Top Bar) */}
          <Link
            href={`/${locale}/favorites`}
            className={cn(
              "relative p-1.5 rounded-lg text-neutral-700 hover:text-neutral-900 transition-colors",
              pathname.startsWith(`/${locale}/favorites`)
                ? "text-brand bg-brand/10 font-semibold"
                : "text-neutral-600",
            )}
            aria-label={t('favorites')}
          >
            <Heart
              className={cn(
                'size-4.5',
                favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : '',
              )}
            />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center leading-none shadow-xs">
                {favoriteCount}
              </span>
            )}
          </Link>

          <Link
            href={`/${locale}/cart`}
            className={cn(
              "relative p-1.5 rounded-lg text-neutral-700 hover:text-neutral-900 transition-colors",
              pathname.startsWith(`/${locale}/cart`)
                ? "text-brand bg-brand/10 font-semibold"
                : "text-neutral-700",
            )}
            aria-label={t('shoppingCart')}
          >
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-[10px] font-bold text-white flex items-center justify-center leading-none shadow-xs">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-600 hover:text-neutral-900"
            aria-label={t('toggleMenu')}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
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
                    'w-full px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors',
                    active
                      ? 'bg-brand text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-600">
            <Link
              href={`/${locale}/favorites`}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full",
                pathname.startsWith(`/${locale}/favorites`)
                  ? "bg-rose-50 text-rose-600 font-semibold"
                  : "hover:bg-neutral-50 text-neutral-700",
              )}
            >
              <div className="relative flex items-center justify-center">
                <Heart
                  className={cn(
                    'size-4',
                    favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : '',
                  )}
                />
                {favoriteCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center leading-none shadow-xs">
                    {favoriteCount}
                  </span>
                )}
              </div>
              <span>{t('favorites')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
