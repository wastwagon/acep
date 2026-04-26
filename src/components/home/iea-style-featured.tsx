import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function IEAFeatured() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Promoting transparency and accountability in Africa&apos;s energy sector
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                After more than a decade of existence, ACEP has established itself as a thought leader in the sector, working to consolidate gains by unpacking the link between resource extraction and inclusive, sustainable development across Africa.
              </p>
              <Link href="/research-and-policy-papers">
                <Button size="lg" className="bg-acep-primary hover:bg-acep-primary/90">
                  Learn more in our reports
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative h-96 rounded-acepCard overflow-hidden bg-slate-100">
              <img
                src="/acep-assets/wp-content/uploads/2024/09/oil-pump.jpg"
                alt="Energy sector in Africa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
