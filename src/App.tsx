import { DashboardPage } from '@/pages/DashboardPage';
import { LandingPage } from '@/pages/LandingPage';
import { ModelPage } from '@/pages/ModelPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ScreeningPage } from '@/pages/ScreeningPage';
import { useLocation } from '@/lib/routing';

function normalisePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/';
}

export default function App() {
  const { pathname } = useLocation();

  switch (normalisePath(pathname)) {
    case '/':
      return <LandingPage />;
    case '/dashboard':
      return <DashboardPage />;
    case '/screening':
      return <ScreeningPage />;
    case '/model':
      return <ModelPage />;
    default:
      return <NotFoundPage />;
  }
}
