export default function ContractDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-slate-50 motion-reduce:animate-none">
      <div className="bg-acep-primary px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-8 w-48 rounded-md bg-white/20" />
          <div className="h-10 max-w-xl rounded-lg bg-white/25" />
          <div className="h-5 w-64 rounded bg-white/15" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-48 rounded-xl border border-slate-200 bg-white shadow-sm" />
            <div className="h-40 rounded-xl border border-slate-200 bg-white shadow-sm" />
          </div>
          <div className="h-64 rounded-xl border border-slate-200 bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}
