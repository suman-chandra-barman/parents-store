'use client';

import { Check, ExternalLink, KeyRound, Users } from 'lucide-react';
import type { PreRegistrationSuccessData } from '../types/pre-registration';

export function PreRegistrationSuccessCard({
  data,
}: {
  data: PreRegistrationSuccessData;
}) {
  return (
    <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      {/* Visual Success Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-950/20">
          <Check className="size-7 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Registration Complete!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your pre-registration details were successfully recorded.
        </p>
      </div>

      {/* Access Password Ticket Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
            <KeyRound className="size-3.5" /> Access Card Password
          </span>
          <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            ACTIVE
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center font-mono text-lg font-bold tracking-wider text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
          {data.accessCardPassword}
        </div>

        <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-200/60 dark:border-slate-700/60">
          <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
            <Users className="size-3.5" /> Group
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {data.group || 'None Assigned'}
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
          <span>Continue to Portal</span>
          <ExternalLink className="size-4" />
        </a>
      )}
    </div>
  );
}
