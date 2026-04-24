export default function LibraryDocumentLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-1 text-sm animate-pulse motion-reduce:animate-none">
            <div className="h-4 w-12 rounded bg-slate-200" />
            <div className="h-4 w-4 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-4 w-4 rounded bg-slate-200" />
            <div className="h-4 w-40 rounded bg-slate-200" />
          </div>
          <div className="mb-4 h-7 w-24 animate-pulse rounded-md bg-slate-200 motion-reduce:animate-none" />
          <div className="h-9 max-w-3xl animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none sm:h-10 md:h-11" />
          <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 md:p-8 motion-reduce:animate-none">
              <div className="mb-4 h-6 w-48 rounded bg-slate-200" />
              <div className="flex flex-wrap gap-3">
                <div className="h-11 w-44 rounded-lg bg-acep-primary/30" />
                <div className="h-11 w-32 rounded-lg border border-slate-200 bg-slate-50" />
              </div>
            </div>
            <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 motion-reduce:animate-none">
              <div className="mb-4 h-5 w-56 rounded bg-slate-200" />
              <div className="space-y-3">
                <div className="h-14 w-full rounded-lg border border-slate-100 bg-slate-50" />
                <div className="h-14 w-full rounded-lg border border-slate-100 bg-slate-50" />
              </div>
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
