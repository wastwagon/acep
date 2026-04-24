export default function OilRevenueLoading() {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 h-9 w-40 rounded-md bg-slate-200" />
          <div className="h-9 max-w-md rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 max-w-xl rounded bg-slate-200" />
        </div>
      </div>
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 max-w-[66%] rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
