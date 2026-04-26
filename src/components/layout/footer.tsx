import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
} from "lucide-react";

const platformLinks = [
  { name: "Contract Monitor", href: "/contracts" },
  { name: "Electricity Monitor", href: "/electricity" },
  { name: "Oil Revenue Tracker", href: "/oil-revenue" },
  { name: "OilMoneyTV", href: "/videos" },
  { name: "OpenTax", href: "/tax" },
];

const quickLinks = [
  { name: "About Us", href: "/about-us" },
  { name: "Our Team", href: "/team" },
  { name: "Publications", href: "/publications" },
  { name: "Events", href: "/events" },
  { name: "Event registration (online)", href: "/e" },
  { name: "Contact", href: "/about-us" },
];

const programLinks = [
  { name: "NextGen Program", href: "/nextgen10" },
  { name: "Africa Climate Academy", href: "/climate-academy" },
  { name: "Future of Energy Conference", href: "/fec-2025" },
  { name: "Resource Governance Hub", href: "/rgchub" },
];

const resourceLinks = [
  { name: "Publications", href: "/publications", description: "All publications in one place" },
  { name: "Photo Gallery", href: "/photo-gallery" },
  { name: "Video Gallery", href: "/video-gallery" },
];

const socialLinks = [
  { 
    name: "Facebook", 
    href: "https://facebook.com/ACEPGhana", 
    icon: Facebook,
  },
  { 
    name: "Twitter", 
    href: "https://twitter.com/ACEPGhana", 
    icon: Twitter,
  },
  { 
    name: "LinkedIn", 
    href: "https://linkedin.com/company/acep-ghana", 
    icon: Linkedin,
  },
  { 
    name: "YouTube", 
    href: "https://youtube.com/@oilmoneytv", 
    icon: Youtube,
  },
];

const footerLinkClass = "text-sm text-slate-600 hover:text-acep-primary transition-colors";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="section-label">Africa Centre for Energy Policy</p>
            <div className="mb-5">
              <Image
                src="/acep-assets/wp-content/uploads/2024/05/ACEP-LOGO-main-1.webp"
                alt="ACEP"
                width={132}
                height={44}
                className="h-10 w-auto opacity-95"
              />
            </div>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600">
              Africa Centre for Energy Policy - Promoting transparency and accountability in Ghana&apos;s energy and extractive sector governance.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-slate-600">
                  <div>Avenue D, Hse. No. 119 D, North Legon</div>
                  <div className="mt-1 text-xs text-slate-500">Digital Address: GM-048-5151</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a href="tel:+233302900730" className="text-slate-600 hover:text-acep-primary transition-colors">
                  (+233) 302 900 730
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a href="mailto:info@acep.africa" className="break-all text-slate-600 hover:text-acep-primary transition-colors">
                  info@acep.africa
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="section-label mb-4">Our Platforms</h3>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={footerLinkClass}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={footerLinkClass}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-4">Programs</h3>
            <ul className="space-y-2 mb-6">
              {programLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={footerLinkClass}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="section-label mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={footerLinkClass}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-acep-primary transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
            <div>
              © {new Date().getFullYear()} Africa Centre for Energy Policy. All Rights Reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="hover:text-acep-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-acep-primary transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
