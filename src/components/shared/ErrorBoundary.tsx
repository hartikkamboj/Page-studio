'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  sectionId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that catches render errors per section.
 * Shows a fallback UI instead of crashing the entire page.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary] Section "${this.props.sectionId}" failed to render:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section
          className="border border-dashed border-red-500/40 bg-red-500/5 px-6 py-12 text-center"
          role="alert"
        >
          <div className="mx-auto max-w-md">
            <div className="mb-3 text-3xl" aria-hidden="true">
              ❌
            </div>
            <h2 className="mb-2 text-lg font-semibold text-red-400">
              Section Render Error
            </h2>
            <p className="text-sm text-slate-400">
              This section failed to render.{' '}
              {this.state.error?.message && (
                <span className="block mt-1 text-red-400/70">
                  {this.state.error.message}
                </span>
              )}
            </p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
