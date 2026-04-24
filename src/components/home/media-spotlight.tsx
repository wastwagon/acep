import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

const CARD_BASE =
  "group relative block overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/80 transition duration-500 hover:border-acep-primary/25 hover:shadow-md";

export function MediaSpotlight() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-10 sm:pb-28 sm:pt-12 md:pt-14 lg:pt-16">
      <div className="container relative z-[1] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex animate-in fade-in slide-in-from-bottom-2 flex-col gap-6 duration-700 fill-mode-both motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:duration-0 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 border-l-[3px] border-acep-secondary pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-acep-primary">
              Stories & media
            </p>
            <h2 className="font-display text-3xl font-medium tracking-[-0.02em] text-acep-primary md:text-[2.1rem]">
              See the work behind the analysis
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base">
              Short films, event highlights, and imagery from ACEP&apos;s programs—paired with the same evidence-led
              approach across publications and data platforms.
            </p>
          </div>
          <Link
            href="/video-gallery"
            className="inline-flex shrink-0 items-center self-start rounded-full border border-acep-primary/25 bg-white px-4 py-2 text-sm font-semibold text-acep-primary shadow-sm transition hover:border-acep-primary/40 hover:bg-acep-primary/[0.04] md:self-auto"
          >
            Browse video gallery
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both delay-100 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:duration-0 lg:col-span-7">
            <Link href="/videos" className={CARD_BASE}>
              <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
                <Image
                  src="/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg"
                  alt="ACEP documentary and video content preview"
                  fill
                  className="object-cover opacity-95 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/35 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-acep-secondary">OilMoneyTV</p>
                  <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Documentaries on how public revenues shape real projects
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-200/95">
                    Watch explainers, field stories, and accountability narratives—built for citizens, media, and
                    policymakers.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-3">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-acep-primary shadow-lg transition duration-300 group-hover:scale-105">
                      <Play className="h-7 w-7 fill-current" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold text-white underline-offset-4 group-hover:underline">
                      Open video library
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex animate-in fade-in slide-in-from-bottom-3 flex-col gap-5 duration-700 fill-mode-both delay-200 motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:duration-0 lg:col-span-5">
            <Link href="/fec-2025" className={CARD_BASE}>
              <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
                <Image
                  src="/acep-assets/wp-content/uploads/2025/12/FEC-2025-feature-image.png"
                  alt="Future of Energy Conference"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/88 via-slate-900/22 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-acep-secondary">
                    Conference & dialogue
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">Future of Energy</p>
                  <span className="mt-2 inline-flex items-center text-xs font-semibold text-white/95">
                    View
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-5">
              <Link href="/photo-gallery" className={CARD_BASE}>
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/acep-assets/wp-content/uploads/2024/06/Public-Forum.jpg"
                    alt="ACEP public forum"
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-acep-secondary">Gallery</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">Field & forums</p>
                  </div>
                </div>
              </Link>
              <Link href="/nextgen10" className={CARD_BASE}>
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/acep-assets/wp-content/uploads/2024/05/2024-Sumer-School-Feature-Img-1.jpg"
                    alt="NextGen resource governance program"
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-acep-secondary">Programs</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">NextGen</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent via-white/60 to-slate-50 sm:h-48"
        aria-hidden
      />
    </section>
  );
}
