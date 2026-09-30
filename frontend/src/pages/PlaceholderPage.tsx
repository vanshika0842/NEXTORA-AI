interface PlaceholderPageProps {
  title: string;
}

/**
 * Stand-in for a route that already exists in the real Nextora app
 * (auth pages, dashboard, profile, etc). Swap these <Route> elements
 * for your real page components in App.tsx — this file is only here
 * so the landing page's links have somewhere to go when run standalone.
 */
export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen grid place-items-center bg-mist-50 text-center px-6">
      <div>
        <p className="text-xs font-mono font-semibold uppercase tracking-wide text-electric-500 mb-3">
          Existing route
        </p>
        <h1 className="text-2xl font-display font-semibold text-ink-900">{title}</h1>
        <p className="mt-2 text-sm text-ink-500 max-w-sm">
          Replace this placeholder with your real {title} page component.
        </p>
      </div>
    </div>
  );
}
