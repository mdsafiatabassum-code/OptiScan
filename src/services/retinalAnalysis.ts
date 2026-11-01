import { API_BASE_URL } from '@/config/env';
import { parseScreeningReport } from '@/services/parseScreeningReport';
import type { ScreeningReport } from '@/types/screening';

export type AnalysisErrorCode =
  | 'not_configured'
  | 'network'
  | 'timeout'
  | 'aborted'
  | 'rejected'
  | 'unavailable'
  | 'server'
  | 'invalid_response';

export class AnalysisError extends Error {
  readonly code: AnalysisErrorCode;

  constructor(code: AnalysisErrorCode, message: string) {
    super(message);
    this.name = 'AnalysisError';
    this.code = code;
  }
}

interface AnalyseOptions {
  signal?: AbortSignal;
  onUploadProgress?: (fraction: number) => void;
  onUploadComplete?: () => void;
}

const REQUEST_TIMEOUT_MS = 120_000;
const ANALYSES_PATH = '/api/v1/analyses';

function errorFromResponse(status: number, body: unknown): AnalysisError {
  if (status === 503) {
    return new AnalysisError(
      'unavailable',
      'The analysis model is not available on the server right now, so no report was generated. Please try again later.',
    );
  }
  if (status >= 400 && status < 500) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body
        ? (body as { error?: { message?: unknown } }).error?.message
        : undefined;
    return new AnalysisError(
      'rejected',
      typeof message === 'string' ? message : 'The image was rejected by the analysis service.',
    );
  }
  return new AnalysisError('server', 'The analysis failed on the server, so no report was generated. Please try again.');
}

function parseBody(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function analyseRetinalImage(file: File, options: AnalyseOptions = {}): Promise<ScreeningReport> {
  if (!API_BASE_URL) {
    return Promise.reject(
      new AnalysisError('not_configured', 'The analysis service is not connected to this site yet, so no report was generated.'),
    );
  }

  return new Promise<ScreeningReport>((resolve, reject) => {
    const { signal, onUploadProgress, onUploadComplete } = options;
    if (signal?.aborted) {
      reject(new AnalysisError('aborted', 'Analysis was cancelled.'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append('file', file, file.name);

    xhr.open('POST', `${API_BASE_URL}${ANALYSES_PATH}`);
    xhr.responseType = 'text';
    xhr.timeout = REQUEST_TIMEOUT_MS;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) onUploadProgress?.(event.loaded / event.total);
    };
    xhr.upload.onload = () => onUploadComplete?.();

    xhr.onerror = () =>
      reject(new AnalysisError('network', 'The analysis service could not be reached. Check your connection and try again.'));
    xhr.ontimeout = () =>
      reject(new AnalysisError('timeout', 'The analysis took too long and was stopped. Please try again.'));
    xhr.onabort = () => reject(new AnalysisError('aborted', 'Analysis was cancelled.'));

    xhr.onload = () => {
      const body = parseBody(xhr.responseText);
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(errorFromResponse(xhr.status, body));
        return;
      }
      try {
        resolve(parseScreeningReport(body));
      } catch {
        reject(new AnalysisError('invalid_response', 'The analysis service returned an unexpected response.'));
      }
    };

    signal?.addEventListener('abort', () => xhr.abort(), { once: true });
    xhr.send(form);
  });
}
