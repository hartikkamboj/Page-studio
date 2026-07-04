'use client';

import type { TestimonialProps } from '@/domain/models/page';

export default function TestimonialSection({
  quote,
  author,
  role,
}: TestimonialProps) {
  return (
    <section
      className="bg-slate-900 px-6 py-20"
      aria-labelledby="testimonial-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="testimonial-heading" className="sr-only">
          Testimonial
        </h2>

        {/* Decorative quote mark */}
        <div
          className="mb-6 text-6xl font-serif text-purple-400/50"
          aria-hidden="true"
        >
          &ldquo;
        </div>

        <blockquote>
          <p className="text-xl leading-relaxed text-slate-200 sm:text-2xl">
            {quote}
          </p>
          <footer className="mt-8">
            <cite className="not-italic">
              <span className="block text-lg font-semibold text-white">
                {author}
              </span>
              {role && (
                <span className="mt-1 block text-sm text-slate-400">
                  {role}
                </span>
              )}
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
