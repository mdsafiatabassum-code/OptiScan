import { useCallback, useEffect, useRef, useState } from 'react';
import { AnalysisError, analyseRetinalImage } from '@/services/retinalAnalysis';
import { validateImageFile } from '@/lib/imageValidation';
import type { AnalysisState } from '@/types/screening';

const UNEXPECTED_ERROR_MESSAGE = 'The analysis could not be completed, so no report was generated. Please try again.';

export function useScreeningFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({ phase: 'idle' });
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [file]);

  const cancelAnalysis = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  useEffect(() => () => cancelAnalysis(), [cancelAnalysis]);

  const selectFile = useCallback(
    (candidate: File) => {
      const error = validateImageFile(candidate);
      if (error) {
        setUploadError(error);
        return;
      }
      cancelAnalysis();
      setUploadError(null);
      setAnalysis({ phase: 'idle' });
      setFile(candidate);
    },
    [cancelAnalysis],
  );

  const clearImage = useCallback(() => {
    cancelAnalysis();
    setFile(null);
    setUploadError(null);
    setAnalysis({ phase: 'idle' });
  }, [cancelAnalysis]);

  const analyse = useCallback(async () => {
    if (!file) return;
    cancelAnalysis();
    const controller = new AbortController();
    controllerRef.current = controller;
    setAnalysis({ phase: 'uploading', progress: 0 });

    try {
      const report = await analyseRetinalImage(file, {
        signal: controller.signal,
        onUploadProgress: (fraction) => {
          if (!controller.signal.aborted) setAnalysis({ phase: 'uploading', progress: fraction });
        },
        onUploadComplete: () => {
          if (!controller.signal.aborted) setAnalysis({ phase: 'analysing' });
        },
      });
      if (!controller.signal.aborted) setAnalysis({ phase: 'complete', report });
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof AnalysisError && error.code === 'quality_rejected') {
        setAnalysis({ phase: 'quality_rejected', message: error.message, checks: error.checks });
        return;
      }
      const message = error instanceof AnalysisError ? error.message : UNEXPECTED_ERROR_MESSAGE;
      setAnalysis({ phase: 'error', message });
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, [file, cancelAnalysis]);

  return {
    file,
    previewUrl,
    uploadError,
    analysis,
    selectFile,
    clearImage,
    analyse,
  };
}
