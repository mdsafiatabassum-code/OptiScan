import { useEffect } from 'react';
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
      <section className="mx-auto flex max-w-6xl flex-col items-center px-5 py-24 text-center sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Page not found</h1>
        <p className="mt-4 max-w-md text-base text-navy-600">
          The page you are looking for does not exist or has moved.
        </p>
        <Link to="/" className={cx(buttonClasses({ size: 'lg' }), 'mt-8')}>
          Return to home
        </Link>
      </section>
    </PageLayout>
  );
}
