import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useT } from '@/lib/i18n';
import { Link } from '@/lib/router';

export function SiteFooter() {
  const t = useT();
  const currentYear = new Date().getFullYear();

  const navLinks: { label: string; to: string }[] = [
    { label: t.navHowItWorks, to: '/#how-it-works' },
    { label: t.navModel, to: '/#model' },
    { label: t.navLimitations, to: '/#limitations' },
    { label: t.navAbout, to: '/#about' },
  ];

  return (
    <footer className="border-t border-white/10 bg-panel/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div className="max-w-md">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-neutral-400">{t.footerDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-100">{t.footerExplore}</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="focus-ring rounded text-neutral-400 transition-colors hover:text-primary-200">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/dashboard" className="focus-ring rounded text-neutral-400 transition-colors hover:text-primary-200">
                  {t.navDashboard}
                </Link>
              </li>
              <li>
                <Link to="/history" className="focus-ring rounded text-neutral-400 transition-colors hover:text-primary-200">
                  {t.navScreeningHistory}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-100">{t.footerResponsibleUse}</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-neutral-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
              {t.footerResponsibleUseText}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>&copy; {currentYear} OptiScan. {t.footerRights}</p>
          <p>{t.footerNotMedicalDevice}</p>
        </div>
      </div>
    </footer>
  );
}
