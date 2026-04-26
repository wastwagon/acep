import { Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideosHero() {
  return (
    <section className="relative border-b border-slate-200 bg-white py-16 sm:py-20 md:py-24">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-acepBtn border border-acep-primary/25 bg-acep-primary/5 px-4 py-2 text-acep-primary">
            <Video className="mr-2 h-4 w-4" aria-hidden />
            <span className="text-sm font-medium sm:text-base">OilMoneyTV</span>
          </div>

          <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
            We are OilMoneyTV
          </h1>

          <p className="mx-auto mb-8 mt-6 max-w-3xl text-lg text-slate-600 sm:text-xl md:text-2xl">
            We show projects in Ghana that are funded by oil revenue. Our goal is to educate the Ghanaian masses on how revenue from Ghana&apos;s oil field is spent and distributed across all sectors of the economy.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-acep-primary text-white hover:bg-acep-primary/90">
              <Play className="mr-2 h-5 w-5" />
              Watch Latest Video
            </Button>
            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Browse Categories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
