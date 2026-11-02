import { useEffect, useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { Logo } from '@/components/common/Logo';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

interface DashboardLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function DashboardLayout({ title, description, children }: DashboardLayoutProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (!isNavOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavOpen]);

  return (
    <div className="min-h-screen">
      <AmbientBackground />
      <DashboardSidebar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-canvas/80 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsNavOpen(true)}
              aria-label="Open navigation"
              aria-expanded={isNavOpen}
              aria-controls="dashboard-sidebar"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-100 transition hover:border-primary-300/40 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>

          <span className="hidden items-center gap-2 rounded-full border border-warning-400/30 bg-warning-400/10 px-3 py-1 text-xs font-semibold text-warning-200 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-warning-300" aria-hidden="true" />
            Research prototype
          </span>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-400">{description}</p>
          </div>
          <div className="mt-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
