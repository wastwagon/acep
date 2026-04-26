export default function PublicationsLoading() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-slate-200 bg-[#fafaf9] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse text-center motion-reduce:animate-none">
          <div className="mx-auto mb-6 h-9 w-48 rounded-acepBtn bg-slate-200" />
          <div className="mx-auto h-10 max-w-md rounded-acepBtn bg-slate-200" />
          <div className="mx-auto mt-4 h-4 max-w-xl rounded bg-slate-200" />
          <div className="mx-auto mt-8 flex flex-wrap justify-center gap-2">
            <div className="h-8 w-28 rounded-acepBtn bg-slate-200" />
            <div className="h-8 w-28 rounded-acepBtn bg-slate-200" />
            <div className="h-8 w-24 rounded-acepBtn bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse space-y-3 motion-reduce:animate-none">
          <div className="h-11 w-full rounded-acepBtn bg-slate-200" />
          <div className="flex flex-wrap gap-2">
            <div className="h-9 w-24 rounded-acepBtn bg-slate-200" />
            <div className="h-9 w-24 rounded-acepBtn bg-slate-200" />
            <div className="h-9 w-24 rounded-acepBtn bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid animate-pulse grid-cols-1 gap-4 motion-reduce:animate-none md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-acepCard border border-slate-200 bg-white shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
