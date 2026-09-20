import React from "react";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-neutral-50 via-white to-neutral-50 text-neutral-900">
      <div className="w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* 404 Heading & Description */}
        <div className="space-y-2">
          <span className="text-6xl sm:text-7xl font-black tracking-tight text-neutral-900 select-none">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Return Home CTA */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-800 hover:bg-neutral-900 active:scale-98 transition-all shadow-sm cursor-pointer"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
