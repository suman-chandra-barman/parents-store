'use client';

import { Check } from 'lucide-react';
import type { PreRegistrationSuccessData } from '../types/pre-registration';

export function PreRegistrationSuccessCard({
  data,
}: {
  data: PreRegistrationSuccessData;
}) {
  return (
    <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 text-green-600">
        <Check className="size-6" />
        <h2 className="text-lg font-semibold">Pre-Registration Submitted!</h2>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between border-b py-2">
          <dt className="text-muted-foreground">Access Card Password</dt>
          <dd className="font-mono font-medium">
            {data.accessCardPassword}
          </dd>
        </div>
        <div className="flex items-center justify-between border-b py-2">
          <dt className="text-muted-foreground">Group</dt>
          <dd className="font-medium">{data.group || '—'}</dd>
        </div>
      </dl>

      {data.redirectLink && (
        <a
          href={data.redirectLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-md bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/90"
        >
          Continue to Registration
        </a>
      )}
    </div>
  );
}
