'use client';

import type { HeroProps } from '@/domain/models/page';

export default function HeroSection({
  headline,
  subtext,
  ctaLabel,
  ctaUrl,
}: HeroProps) {
  return (
    <section
      className="relative flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-24 text-center text-white"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent motion-safe:animate-pulse"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl">
        <h1
          id="hero-heading"
          className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          {headline}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl">
          {subtext}
        </p>

        {ctaLabel && ctaUrl && (
          <a
            href={ctaUrl}
            className="inline-flex items-center rounded-full bg-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:bg-purple-500 hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 motion-safe:hover:scale-105"
          >
            {ctaLabel}
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
