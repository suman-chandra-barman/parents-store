"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, AlertCircle, Check, Building2 } from "lucide-react";
import { fetchPreRegistrationForm, submitPreRegistration } from "../utils/pre-registration-api";
import type { PreRegistrationForm } from "../types/pre-registration";

interface PreRegistrationFormComponentProps {
  urlPassword: string;
}

export function PreRegistrationFormComponent({
  urlPassword,
}: PreRegistrationFormComponentProps) {
  const [formData, setFormData] = useState({
    password: urlPassword,
    name: "",
    email: "",
    phone: "",
    group: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Auto-fetch is kicked off on mount when a URL password is present, so start
  // in the fetching state instead of flipping it inside an effect.
  const [isFetching, setIsFetching] = useState(() => Boolean(urlPassword));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    accessCardPassword: string;
    group: string;
    redirectLink: string;
  } | null>(null);
  const [preRegForm, setPreRegForm] = useState<PreRegistrationForm | null>(null);

  // State is only ever touched inside promise callbacks, never synchronously,
  // so calling this from the effect below satisfies react-hooks/set-state-in-effect.
  const loadForm = useCallback((passwordToUse: string) => {
    if (!passwordToUse) return;

    fetchPreRegistrationForm(passwordToUse)
      .then((response) => {
        setPreRegForm(response.data);
        setError(null);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to load form";
        setError(message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  // Auto-fetch form if password is provided via URL
  useEffect(() => {
    if (urlPassword) {
      void loadForm(urlPassword);
    }
  }, [urlPassword, loadForm]);

  

  const handleFormFetchClick = () => {
    if (!formData.password) {
      setError("Please enter a password");
      return;
    }
    setError(null);
    setIsFetching(true);
    void loadForm(formData.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await submitPreRegistration({
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        group: formData.group,
      });
      setRegistrationData({
        accessCardPassword: response.data.accessCard.password,
        group: response.data.accessCard.group,
        redirectLink: response.data.redirectLink,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit registration";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (success && registrationData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-3 text-green-600">
            <Check className="size-6" />
            <h2 className="text-lg font-semibold">
              Pre-Registration Submitted!
            </h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">
                Access Card Password
              </span>
              <span className="font-mono font-medium">
                {registrationData.accessCardPassword}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Group</span>
              <span className="font-medium">{registrationData.group}</span>
            </div>
          </div>
          {registrationData.redirectLink && (
            <a
              href={registrationData.redirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
            >
              Continue to Registration
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-sm border p-6 space-y-6">
        <div className="text-center">
          <Building2 className="size-10 text-brand mx-auto mb-3" />
          <h1 className="text-xl font-semibold">Pre-Registration</h1>
          <p className="text-sm text-muted-foreground">
            Enter your password to view the form
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 text-sm">
            <AlertCircle className="size-4" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {!preRegForm ? (
          <div className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
            <button
              type="button"
              onClick={handleFormFetchClick}
              disabled={isFetching || !formData.password}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {isFetching && <Loader2 className="size-4 animate-spin" />}
              {isFetching ? "Loading..." : "View Form"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">{preRegForm.title}</h2>
              <div
                className="text-sm text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: preRegForm.notes }}
              />
            </div>

            {preRegForm.noticeTitle && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <p className="font-medium text-amber-700">
                  {preRegForm.noticeTitle}
                </p>
                <div
                  className="text-sm text-amber-600 mt-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: preRegForm.noticeInformation,
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            {preRegForm.selectable &&
              preRegForm.selectableGroups.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Group</label>
                  <select
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
                    required
                  >
                    <option value="">Select a group</option>
                    {preRegForm.selectableGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.name ||
                !formData.email ||
                !formData.group
              }
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Pre-Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
