'use client';

import type { FeatureGridProps } from '@/domain/models/page';

export default function FeatureGridSection({
  heading,
  features,
}: FeatureGridProps) {
  return (
    <section
      className="bg-slate-950 px-6 py-20"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="features-heading"
          className="mb-14 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          {heading}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={index}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900 motion-safe:hover:-translate-y-1"
            >
              {feature.icon && (
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl text-purple-400"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
              )}
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
