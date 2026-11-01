import { useEffect, useState } from 'react';

const NAVIGATE_EVENT = 'optiscan:navigate';

export interface RouteLocation {
  pathname: string;
  hash: string;
}

function readLocation(): RouteLocation {
  return { pathname: window.location.pathname, hash: window.location.hash };
}

export function scrollToHash(hash: string) {
  if (!hash) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href);
  const isSamePage = url.pathname === window.location.pathname;
  window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));

  if (!url.hash) {
    window.scrollTo({ top: 0 });
  } else if (isSamePage) {
    scrollToHash(url.hash);
  }
}

export function isActiveRoute(to: string, location: RouteLocation) {
  const target = new URL(to, window.location.href);
  return target.pathname === location.pathname && target.hash === location.hash;
}

export function useLocation(): RouteLocation {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const sync = () => setLocation(readLocation());
    window.addEventListener('popstate', sync);
    window.addEventListener(NAVIGATE_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAVIGATE_EVENT, sync);
    };
  }, []);

  return location;
}
