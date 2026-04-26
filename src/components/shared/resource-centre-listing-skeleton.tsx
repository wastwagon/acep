/**
 * Route-level loading placeholders for heavy listing pages.
 * No "use client" — safe as RSC / loading.tsx subtree.
 */

export function ResourceCentreListingSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="h-10 max-w-xl animate-pulse rounded-acepBtn bg-slate-200 motion-reduce:animate-none sm:h-11 md:h-12" />
          <div className="mt-4 h-4 max-w-2xl animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          <div className="mt-2 h-4 max-w-xl animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        </div>
      </div>
      <div className="sticky top-20 z-40 border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="h-11 flex-1 animate-pulse rounded-acepBtn bg-slate-200 motion-reduce:animate-none" />
            <div className="h-11 w-full shrink-0 animate-pulse rounded-acepBtn border border-slate-200 bg-white md:w-52 motion-reduce:animate-none" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="divide-y divide-slate-200 lg:col-span-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-6 animate-pulse motion-reduce:animate-none">
                <div className="flex gap-6">
                  <div className="hidden h-32 w-48 shrink-0 rounded-acepBtn bg-slate-200 sm:block" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-28 rounded-acepBtn bg-slate-200" />
                      <div className="h-5 w-20 rounded-acepBtn bg-slate-100" />
                    </div>
                    <div className="h-3 w-32 rounded bg-slate-100" />
                    <div className="h-6 max-w-lg rounded bg-slate-200" />
                    <div className="h-3 max-w-xl rounded bg-slate-100" />
                    <div className="h-3 w-[90%] max-w-xl rounded bg-slate-100" />
                    <div className="h-4 w-28 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="animate-pulse rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm motion-reduce:animate-none">
                <div className="mb-4 h-4 w-36 rounded bg-slate-200" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 rounded bg-slate-100" />
                  ))}
                </div>
              </div>
              <div className="animate-pulse rounded-acepCard border border-slate-200 bg-white p-6 shadow-sm motion-reduce:animate-none">
                <div className="mb-4 h-4 w-40 rounded bg-slate-200" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-9 rounded-acepBtn bg-slate-100" />
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

export function ReportsHubSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="h-10 max-w-lg animate-pulse rounded-acepBtn bg-slate-200 motion-reduce:animate-none md:h-12" />
          <div className="mt-4 h-4 max-w-2xl animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        </div>
      </div>
      <div className="sticky top-20 z-40 border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
            <div className="h-11 min-w-[200px] flex-1 animate-pulse rounded-acepBtn bg-slate-200 motion-reduce:animate-none" />
            <div className="h-11 w-44 animate-pulse rounded-acepBtn border border-slate-200 bg-white motion-reduce:animate-none" />
            <div className="h-11 w-40 animate-pulse rounded-acepBtn border border-slate-200 bg-white motion-reduce:animate-none" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-acepCard border border-slate-200 bg-white p-6 motion-reduce:animate-none"
                >
                  <div className="h-8 w-14 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
                </div>
              ))}
            </div>
            <div className="space-y-8">
              {Array.from({ length: 2 }).map((_, y) => (
                <div key={y}>
                  <div className="mb-6 h-8 w-44 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-80 animate-pulse rounded-acepCard border border-slate-200 bg-white motion-reduce:animate-none"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="animate-pulse rounded-acepCard border border-slate-200 bg-white p-6 motion-reduce:animate-none">
                <div className="mb-4 h-4 w-32 rounded bg-slate-200" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 rounded bg-slate-100" />
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

export function ResourceCentreHubSkeleton() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl animate-pulse motion-reduce:animate-none">
          <div className="h-10 max-w-md rounded-acepBtn bg-slate-200" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-2 h-4 max-w-lg rounded bg-slate-100" />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-acepCard border border-slate-200 motion-reduce:animate-none"
            />
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-acepCard border border-slate-200 p-6 motion-reduce:animate-none"
            >
              <div className="h-5 max-w-[12rem] rounded bg-slate-200" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-12 rounded-acepBtn bg-slate-100" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
