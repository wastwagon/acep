export default function AcepSnapshotLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="mb-6 h-9 w-44 max-w-full animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none" />
          <div className="mb-4 h-7 w-28 max-w-full animate-pulse rounded-md bg-slate-200 motion-reduce:animate-none" />
          <div className="mb-4 h-4 w-40 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          <div className="h-10 max-w-4xl animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none sm:h-12 md:h-14" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8 h-56 w-full animate-pulse rounded-lg border border-slate-200 bg-white motion-reduce:animate-none" />
            <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 md:p-8 motion-reduce:animate-none">
              <div className="mb-4 h-4 w-full rounded bg-slate-200" />
              <div className="mb-3 h-4 w-[92%] rounded bg-slate-200" />
              <div className="mb-3 h-4 w-[88%] rounded bg-slate-200" />
              <div className="mt-8 h-24 w-full rounded-lg bg-slate-100" />
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 motion-reduce:animate-none">
                <div className="mb-4 h-4 w-32 rounded bg-slate-200" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-full rounded bg-slate-100" />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
