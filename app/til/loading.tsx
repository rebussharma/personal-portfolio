export default function Loading() {
  return (
    <main id="main" className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-950" aria-busy="true" aria-label="Loading TIL entries">
      <div className="max-w-3xl space-y-4 motion-safe:animate-pulse">
        <div className="h-7 w-48 rounded bg-gray-200 dark:bg-gray-800" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </main>
  )
}
