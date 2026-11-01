import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { buttonClasses } from '@/components/common/buttonStyles';
import { NAV_LINKS } from '@/config/navigation';
import { cx } from '@/lib/classNames';
import { Link } from '@/lib/router';
import { isActiveRoute, useLocation } from '@/lib/routing';

export function SiteHeader() {
  const location = useLocation();
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
        isHighlighted
          ? 'border-navy-100 bg-white/90 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="OptiScan home" onClick={closeMenu} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isActiveRoute(link.to, location);
            return (
              <Link
                key={link.label}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={cx(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  isActive ? 'text-brand-700' : 'text-navy-600',
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link to="/screening" className={cx(buttonClasses({ size: 'sm' }), 'ml-3')}>
            Start Screening
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-800 shadow-sm transition hover:border-brand-300 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="animate-fade-in border-t border-navy-100 bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {NAV_LINKS.map((link) => {
              const isActive = isActiveRoute(link.to, location);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMenu}
                  aria-current={isActive ? 'page' : undefined}
                  className={cx(
                    'rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-brand-50 hover:text-brand-800',
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-navy-700',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/screening"
              onClick={closeMenu}
              className={cx(buttonClasses({ size: 'lg', fullWidth: true }), 'mt-3')}
            >
              Start Screening
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
