'use client';

import type { CTAProps } from '@/domain/models/page';

export default function CTASection({
  heading,
  description,
  buttonLabel,
  buttonUrl,
}: CTAProps) {
  return (
    <section
      className="bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-slate-900 px-6 py-20"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="cta-heading"
          className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          {heading}
        </h2>

        {description && (
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-300">
            {description}
          </p>
        )}

        <a
          href={buttonUrl}
          className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-100 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900 motion-safe:hover:scale-105"
        >
          {buttonLabel}
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
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
