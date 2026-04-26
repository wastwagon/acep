export default function ContractsLoading() {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 h-9 w-40 rounded-acepBtn bg-slate-200" />
          <div className="h-9 max-w-lg rounded-acepBtn bg-slate-200" />
          <div className="mt-3 h-4 max-w-xl rounded bg-slate-200" />
        </div>
      </div>
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <div className="h-28 rounded-acepCard border border-slate-200 bg-white shadow-sm" />
          <div className="h-28 rounded-acepCard border border-slate-200 bg-white shadow-sm" />
          <div className="h-28 rounded-acepCard border border-slate-200 bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}
