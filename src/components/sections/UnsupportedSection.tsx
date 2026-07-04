'use client';

interface UnsupportedSectionProps {
  type: string;
}

export default function UnsupportedSection({ type }: UnsupportedSectionProps) {
  return (
    <section
      className="border border-dashed border-amber-500/40 bg-amber-500/5 px-6 py-12 text-center"
      role="alert"
    >
      <div className="mx-auto max-w-md">
        <div className="mb-3 text-3xl" aria-hidden="true">
          ⚠️
        </div>
        <h2 className="mb-2 text-lg font-semibold text-amber-400">
          Unsupported Section
        </h2>
        <p className="text-sm text-slate-400">
          Section type <code className="rounded bg-slate-800 px-2 py-0.5 text-amber-300">&quot;{type}&quot;</code> is not
          registered in the section registry.
        </p>
      </div>
    </section>
  );
}
