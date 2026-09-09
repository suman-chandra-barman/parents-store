'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ─── SVG Flag Components ──────────────────────────────────────────────────────
const FlagUK = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-4 h-3 rounded-[2px] shrink-0">
    <clipPath id="flag-uk-a"><path d="M0 0v30h60V0z" /></clipPath>
    <clipPath id="flag-uk-b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z" /></clipPath>
    <g clipPath="url(#flag-uk-a)">
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#flag-uk-b)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const FlagDE = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" className="w-4 h-3 rounded-[2px] shrink-0">
    <rect width="5" height="3" fill="#FFCE00" />
    <rect width="5" height="2" fill="#DD0000" />
    <rect width="5" height="1" fill="#000" />
  </svg>
);

// ─── Config ───────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', nameKey: 'english', Flag: FlagUK },
  { code: 'de', nameKey: 'german', Flag: FlagDE },
] as const;

type Locale = (typeof LANGUAGES)[number]['code'];

export function LanguageSwitcher() {
  const [langOpen, setLangOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('LanguageSwitcher');

  const currentLang = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0];

  const handleLanguageChange = (newLocale: Locale) => {
    setLangOpen(false);
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLocale;
      const newPath = segments.join('/');
      const queryString = searchParams ? searchParams.toString() : '';
      const targetUrl = queryString ? `${newPath}?${queryString}` : newPath;
      router.push(targetUrl);
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        id="navbar-lang-switcher"
        variant="outline"
        size="sm"
        aria-haspopup="listbox"
        aria-expanded={langOpen}
        onClick={() => setLangOpen((v) => !v)}
        className="rounded-full px-3 h-8 text-xs font-semibold gap-1.5 border-neutral-200 bg-white hover:bg-neutral-50 shadow-xs"
      >
        <currentLang.Flag />
        <span className="uppercase tracking-wider font-bold text-[11px] text-neutral-800">{currentLang.code}</span>
        <ChevronDown className={cn("size-3.5 text-neutral-500 transition-transform duration-200", langOpen && "rotate-180")} />
      </Button>

      {langOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
          <ul
            role="listbox"
            aria-labelledby="navbar-lang-switcher"
            className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="px-3 pb-1.5 mb-1 border-b border-neutral-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {t('selectLanguage')}
              </span>
            </div>
            {LANGUAGES.map((lang) => (
              <li key={lang.code} role="option" aria-selected={locale === lang.code}>
                <button
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer",
                    locale === lang.code
                      ? "text-[#2060b0] font-bold bg-[#2060b0]/10"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <lang.Flag />
                    <span>{t(lang.nameKey)}</span>
                  </div>
                  {locale === lang.code && (
                    <Check className="size-3.5 text-[#2060b0]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
