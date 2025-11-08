export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">
            Performance Dashboard
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Dashboard content will go here */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
              <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-2">
                Metrics
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Performance metrics will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

