import React from "react";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-neutral-50 via-white to-neutral-50 text-neutral-900">
      <div className="w-full max-w-lg text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="space-y-2">
          <span className="text-7xl font-black tracking-tight text-neutral-900">
            404
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-black hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
