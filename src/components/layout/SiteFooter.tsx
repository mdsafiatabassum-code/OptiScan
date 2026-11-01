import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { NAV_LINKS } from '@/config/navigation';
import { Link } from '@/lib/router';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-navy-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div className="max-w-md">
          <Logo tone="light" />
          <p className="mt-4 text-base font-semibold text-accent-200">Detect Early. Protect Vision.</p>
          <p className="mt-3 text-sm leading-relaxed text-navy-300">
            OptiScan is an early-stage screening support prototype. It does not provide medical diagnoses and has
            not been clinically validated. It is designed to support, not replace, qualified healthcare
            professionals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Explore</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-navy-200 transition-colors hover:text-accent-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Responsible use</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-navy-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
              Always confirm findings with a qualified eye care professional.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>&copy; {currentYear} OptiScan. All rights reserved.</p>
          <p>Prototype frontend. Not a medical device.</p>
        </div>
      </div>
    </footer>
  );
}
