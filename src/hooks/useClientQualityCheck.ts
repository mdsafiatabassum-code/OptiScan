import { useCallback, useEffect, useRef, useState } from 'react';
import { loadImageElement, runQualityCheck, type ClientQualityResult } from '@/lib/imageQualityCheck';

export type QualityCheckState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; result: ClientQualityResult }
  | { status: 'error'; message: string };

export function useClientQualityCheck(previewUrl: string | null) {
  const [state, setState] = useState<QualityCheckState>({ status: 'idle' });
  const currentUrlRef = useRef<string | null>(null);

  const check = useCallback(async (url: string) => {
    setState({ status: 'loading' });
    try {
      const img = await loadImageElement(url);
      const result = await runQualityCheck(img);
      setState({ status: 'ready', result });
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error ? error.message : 'Quality check failed.' });
    }
  }, []);

  useEffect(() => {
    currentUrlRef.current = previewUrl;
    if (!previewUrl) {
      setState({ status: 'idle' });
      return;
    }
    check(previewUrl);
  }, [previewUrl, check]);

  return state;
}
