import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BarChart3, Newspaper } from "lucide-react";

export function IEAMission() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 text-center">
            We provide authoritative analysis, data, policy recommendations and solutions to ensure energy transparency and help Africa transition to sustainable energy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-acepBtn bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Understand</h3>
              <p className="text-slate-600 mb-4">the African energy system</p>
              <Link href="/research-and-policy-papers">
                <Button variant="outline" className="border-acep-primary text-acep-primary hover:bg-acep-primary hover:text-white">
                  Reports and analysis
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-acepBtn bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Explore</h3>
              <p className="text-slate-600 mb-4">authoritative data sets and visualisations</p>
              <Link href="/oil-revenue">
                <Button variant="outline" className="border-acep-primary text-acep-primary hover:bg-acep-primary hover:text-white">
                  Data and statistics
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-acepBtn bg-gradient-to-br from-acep-primary to-acep-secondary flex items-center justify-center">
                <Newspaper className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Keep up</h3>
              <p className="text-slate-600 mb-4">with the dialogue on energy</p>
              <Link href="/news-blog-posts">
                <Button variant="outline" className="border-acep-primary text-acep-primary hover:bg-acep-primary hover:text-white">
                  News and commentaries
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
