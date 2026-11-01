import { LandingPage } from '@/pages/LandingPage';
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
    case '/screening':
      return <ScreeningPage />;
    default:
      return <NotFoundPage />;
  }
}
