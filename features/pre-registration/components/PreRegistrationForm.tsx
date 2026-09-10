'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Building2,
  Calendar,
  Clock,
  Lock,
  Loader2,
  ShieldAlert,
  Info,
  FileText,
} from 'lucide-react';
import type {
  PreRegistrationForm,
  PreRegistrationSuccessData,
} from '../types/pre-registration';
import { useLazyGetPreRegistrationFormQuery } from '../api/preRegistrationApi';
import { parseErrorMessage } from '@/utils/parseErrorMessage';
import { PreRegistrationFormFields } from './PreRegistrationFormFields';
import { PreRegistrationSuccessCard } from './PreRegistrationSuccessCard';

function isDeadlinePassed(deadlineAt: string): boolean {
  return new Date(deadlineAt).getTime() < Date.now();
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PreRegistrationFormComponent({
  urlPassword,
}: {
  urlPassword: string;
}) {
  const t = useTranslations('PreRegistration');
  const [password, setPassword] = useState(urlPassword);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PreRegistrationForm | null>(null);
  const [success, setSuccess] = useState<PreRegistrationSuccessData | null>(
    null,
  );

  const [triggerFetch, { isLoading: isFetching }] =
    useLazyGetPreRegistrationFormQuery();

  const loadForm = useCallback(
    (passwordToUse: string) => {
      if (!passwordToUse) return;

      triggerFetch(passwordToUse, true)
        .unwrap()
        .then((response) => {
          setForm(response.data);
          setError(null);
        })
        .catch((err: unknown) => {
          setError(parseErrorMessage(err, 'Failed to load form'));
        });
    },
    [triggerFetch]
  );

  useEffect(() => {
    if (urlPassword) void loadForm(urlPassword);
  }, [urlPassword, loadForm]);

  const handleFetch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setError(t('passwordRequired'));
      return;
    }
    setError(null);
    loadForm(password);
  };

  if (success) {
    return (
      <main
        style={{
          backgroundImage: "url('/images/pre-registration/cover.jpg')",
        }}
        className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-no-repeat bg-cover"
      >
        <PreRegistrationSuccessCard data={success} />
      </main>
    );
  }

  const isExpired = form ? isDeadlinePassed(form.deadlineAt) : false;

  return (
    <main
      style={{
        backgroundImage: "url('/images/pre-registration/cover.jpg')",
      }}
      className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-no-repeat bg-cover"
    >
      <div className="backdrop-blur-md bg-white/50 w-full max-w-5xl rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:shadow-none overflow-hidden">
        {form ? (
          /* Two-Column Grid Layout when unlocked */
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-150">
            {/* Left Column: Job & Notice Info Panel */}
            <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Brand Header */}
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand ring-4 ring-brand/5">
                    <Building2 className="size-5 text-brand" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">
                      {t('title')}
                    </span>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {form.title}
                    </h1>
                  </div>
                </div>

                {/* Deadline Badge */}
                <div
                  className={`flex items-center justify-between rounded-xl p-3.5 text-xs font-medium border ${
                    isExpired
                      ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400'
                      : 'border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0 text-slate-400" />
                    {isExpired ? t('status') : t('deadline')}
                  </span>
                  <span className="font-semibold">
                    {isExpired ? t('closed') : formatDate(form.deadlineAt)}
                  </span>
                </div>

                {/* Job Notes Render */}
                {form.notes && (
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <FileText className="size-3.5" /> {t('detailsAndInfo')}
                    </h3>
                    <div className="rounded-xl bg-white p-4 border border-slate-200/80 shadow-sm dark:bg-slate-800/40 dark:border-slate-800">
                      <div
                        className="prose prose-slate prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-li:my-0.5 text-xs text-slate-600 dark:text-slate-300"
                        dangerouslySetInnerHTML={{ __html: form.notes }}
                      />
                    </div>
                  </div>
                )}

                {/* Notice Alert Box */}
                {form.noticeTitle && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <div className="flex items-start gap-2.5">
                      <Info className="mt-0.5 size-4 text-amber-600 shrink-0 dark:text-amber-400" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                          {form.noticeTitle}
                        </h4>
                        <div
                          className="prose prose-amber prose-xs max-w-none text-xs text-amber-700 dark:text-amber-300"
                          dangerouslySetInnerHTML={{
                            __html: form.noticeInformation,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Form Fields Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              {error && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
                >
                  <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-semibold">{t('submissionError')}</p>
                    <p className="text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {isExpired ? (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300"
                >
                  <Calendar className="mx-auto mb-3 size-10 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-base font-bold">{t('registrationClosed')}</h3>
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                    {t('registrationClosedDesc')}
                  </p>
                </div>
              ) : (
                <PreRegistrationFormFields
                  preRegForm={form}
                  password={password}
                  onSuccess={setSuccess}
                />
              )}
            </div>
          </div>
        ) : (
          /* Password Input Gate (Centered layout before unlock) */
          <div className="p-8 sm:p-12 max-w-md mx-auto space-y-6">
            <header className="text-center space-y-2">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand ring-8 ring-brand/5">
                <Building2 className="size-6 text-brand" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t('title')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('enterPasswordPrompt')}
              </p>
            </header>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300"
              >
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" />
                <div className="text-xs">
                  <p className="font-semibold">{t('accessError')}</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleFetch} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isFetching || !password.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand/90 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:opacity-50"
              >
                {isFetching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t('unlockForm')
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
