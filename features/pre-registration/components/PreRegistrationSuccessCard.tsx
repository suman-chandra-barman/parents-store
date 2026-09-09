/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  Download,
  ExternalLink,
  QrCode,
  Users,
  Loader2,
} from 'lucide-react';
import type { PreRegistrationSuccessData } from '../types/pre-registration';
import { env } from '@/config/env';

export function PreRegistrationSuccessCard({
  data,
}: {
  data: PreRegistrationSuccessData;
}) {
  const t = useTranslations('PreRegistration');
  const [isDownloading, setIsDownloading] = useState(false);

  // Construct QR code image URL dynamically from props/data
  const qrCodeUrl = `${env.mediaBaseUrl}/qr-codes/access-card/${encodeURIComponent(
    data.accessCardPassword,
  )}`;

  // Handler to fetch and download the QR code image as a file
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `access-card-qr-${data.accessCardPassword}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download QR code image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      {/* Visual Success Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-950/20">
          <Check className="size-7 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('successTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('successSubtitle')}
        </p>
      </div>

      {/* QR Code Ticket Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
            <QrCode className="size-3.5" /> {t('accessPassQr')}
          </span>
          <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {t('active')}
          </span>
        </div>

        {/* Dynamic QR Code Box */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <img
            src={qrCodeUrl}
            alt="Access Card QR Code"
            className="size-44 object-contain"
            loading="eager"
          />
        </div>

        {/* Download Button Action */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          {isDownloading ? (
            <Loader2 className="size-3.5 animate-spin text-slate-500" />
          ) : (
            <Download className="size-3.5" />
          )}
          <span>{isDownloading ? t('downloading') : t('downloadQr')}</span>
        </button>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-200/60 dark:border-slate-700/60">
          <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
            <Users className="size-3.5" /> {t('group')}
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {data.group || t('noneAssigned')}
          </span>
        </div>
      </div>

      {/* Redirect Link CTA */}
      {data.redirectLink && (
        <a
          href={data.redirectLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand/90 focus:outline-none focus:ring-4 focus:ring-brand/20"
        >
          <span>{t('continueToPortal')}</span>
          <ExternalLink className="size-4" />
        </a>
      )}
    </div>
  );
}
