import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { NAV_LINKS } from '@/config/navigation';
import { buttonClasses } from '@/components/common/buttonStyles';
import { useT } from '@/lib/i18n';
import { cx } from '@/lib/classNames';
import { Link } from '@/lib/router';
import { isActiveRoute, useLocation } from '@/lib/routing';

export function SiteHeader() {
  const location = useLocation();
  const t = useT();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const isHighlighted = isScrolled || isMenuOpen;

  return (
    <header
      className={cx(
        'sticky top-0 z-50 border-b transition-all duration-300',
        isHighlighted ? 'border-white/10 bg-canvas/85 backdrop-blur-xl' : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" aria-label="OptiScan home" onClick={closeMenu} className="focus-ring rounded-lg">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isActiveRoute(link.to, location);
            return (
              <Link
                key={link.labelKey}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'focus-ring rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'text-primary-200' : 'text-neutral-300 hover:text-neutral-50',
                )}
              >
                {t[link.labelKey]}
              </Link>
            );
          })}
          <Link to="/screening" className={cx(buttonClasses({ size: 'sm' }), 'ml-3')}>
            {t.navStartScreening}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? t.navCloseMenu : t.navOpenMenu}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-100 transition hover:border-primary-300/40 lg:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="animate-fade-in border-t border-white/10 bg-canvas/95 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {NAV_LINKS.map((link) => {
              const isActive = isActiveRoute(link.to, location);
              return (
                <Link
                  key={link.labelKey}
                  to={link.to}
                  onClick={closeMenu}
                  aria-current={isActive ? 'page' : undefined}
                  className={cx(
                    'focus-ring rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                    isActive ? 'bg-primary-400/10 text-primary-200' : 'text-neutral-200 hover:bg-white/5 hover:text-white',
                  )}
                >
                  {t[link.labelKey]}
                </Link>
              );
            })}
            <Link
              to="/screening"
              onClick={closeMenu}
              className={cx(buttonClasses({ size: 'lg', fullWidth: true }), 'mt-3')}
            >
              {t.navStartScreening}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
