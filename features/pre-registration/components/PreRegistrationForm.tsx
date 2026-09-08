'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Building2, Loader2 } from 'lucide-react';
import type {
  PreRegistrationForm,
  PreRegistrationSuccessData,
} from '../types/pre-registration';
import { fetchPreRegistrationForm } from '../utils/pre-registration-api';
import { PreRegistrationFormFields } from './PreRegistrationFormFields';
import { PreRegistrationSuccessCard } from './PreRegistrationSuccessCard';

const pageClass =
  'flex min-h-screen items-center justify-center bg-background p-4';
const cardClass = 'w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm';
const inputClass =
  'w-full rounded-md border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50';

export function PreRegistrationFormComponent({
  urlPassword,
}: {
  urlPassword: string;
}) {
  const [password, setPassword] = useState(urlPassword);
  // A URL password auto-fetches on mount, so start in the fetching state
  // instead of flipping it inside an effect.
  const [isFetching, setIsFetching] = useState(() => Boolean(urlPassword));
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PreRegistrationForm | null>(null);
  const [success, setSuccess] = useState<PreRegistrationSuccessData | null>(null);

  // State is only touched inside promise callbacks, never synchronously, so
  // calling this from the effect below satisfies react-hooks/set-state-in-effect.
  const loadForm = useCallback((passwordToUse: string) => {
    if (!passwordToUse) return;

    fetchPreRegistrationForm(passwordToUse)
      .then((loaded) => {
        setForm(loaded);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load form');
      })
      .finally(() => setIsFetching(false));
  }, []);

  // Auto-fetch the form when the password comes from the URL.
  useEffect(() => {
    if (urlPassword) void loadForm(urlPassword);
  }, [urlPassword, loadForm]);

  const handleFetch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError(null);
    setIsFetching(true);
    loadForm(password);
  };

  if (success) {
    return (
      <main className={pageClass}>
        <PreRegistrationSuccessCard data={success} />
      </main>
    );
  }

  return (
    <main className={pageClass}>
      <div className={cardClass}>
        <header className="text-center">
          <Building2 className="mx-auto mb-3 size-10 text-brand" />
          <h1 className="text-xl font-semibold">Pre-Registration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {form
              ? 'Complete your details below'
              : 'Enter your password to view the form'}
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {form ? (
          <PreRegistrationFormFields
            preRegForm={form}
            password={password}
            onSuccess={setSuccess}
          />
        ) : (
          <form onSubmit={handleFetch} className="space-y-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="off"
              placeholder="Enter password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={isFetching || !password}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
            >
              {isFetching && <Loader2 className="size-4 animate-spin" />}
              {isFetching ? 'Loading…' : 'View Form'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
