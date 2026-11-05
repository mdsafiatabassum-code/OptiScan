import { ArrowLeft, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { DASHBOARD_LINKS } from '@/config/navigation';
import { useT } from '@/lib/i18n';
import { cx } from '@/lib/classNames';
import { Link } from '@/lib/router';
import { isActiveRoute, useLocation } from '@/lib/routing';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  const t = useT();

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-canvas/70 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className={cx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-panel/95 backdrop-blur-xl transition-transform duration-300 ease-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full invisible lg:visible',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link to="/dashboard" onClick={onClose} aria-label="OptiScan dashboard overview" className="focus-ring rounded-lg">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.navCloseNavigation}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1 px-3 py-6">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{t.workspace}</p>
          {DASHBOARD_LINKS.map(({ labelKey, to, icon: Icon }) => {
            const isActive = isActiveRoute(to, location);
            return (
              <Link
                key={labelKey}
                to={to}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-primary-400/10 text-primary-200 ring-1 ring-inset ring-primary-300/30'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-neutral-50',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {t[labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            onClick={onClose}
            className="focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-300 transition-colors hover:bg-white/5 hover:text-neutral-50"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t.navBackToWebsite}
          </Link>
          <div className="mt-3 rounded-xl border border-warning-400/20 bg-warning-400/5 p-3 text-xs leading-relaxed text-neutral-300">
            {t.sidebarDisclaimer}
          </div>
          <div className="mt-3">
            <LanguageSwitcher compact />
          </div>
        </div>
      </aside>
    </>
  );
}
