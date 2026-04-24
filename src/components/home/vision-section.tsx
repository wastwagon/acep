export function VisionSection() {
  return (
    <section className="bg-white py-14 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8 border-y border-slate-200 py-10 lg:grid-cols-2 lg:gap-12 lg:py-14">
            <div className="text-left">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Our Vision
              </p>
              <h2
                className="font-display text-2xl font-medium leading-[1.15] tracking-[-0.02em] text-slate-900 sm:text-3xl lg:text-[2.15rem]"
              >
                An Africa in which energy & extractive resources are utilised for economic transformation & sustainable inclusive development.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-7 text-slate-600">
              <p>
                Our focus is to create a strong connection between research evidence and advocacy to increase transparency and accountability around energy & extractive sector governance in the region.
              </p>
              <p>
                After a decade-plus of existence, we have established ourself as a thought leader in the sector and hope to consolidate the gains made over the period by unpacking the link between resource extraction and inclusive, sustainable development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
