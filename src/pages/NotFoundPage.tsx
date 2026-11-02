import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { buttonClasses } from '@/components/common/buttonStyles';
import { PageLayout } from '@/components/layout/PageLayout';
import { cx } from '@/lib/classNames';
import { Link } from '@/lib/router';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | OptiScan';
  }, []);

  return (
    <PageLayout>
      <section className="mx-auto flex max-w-6xl flex-col items-center px-5 py-28 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl">Page not found</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400">
          The page you are looking for does not exist or has moved.
        </p>
        <Link to="/" className={cx(buttonClasses({ size: 'lg' }), 'mt-8')}>
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Return to home
        </Link>
      </section>
    </PageLayout>
  );
}
