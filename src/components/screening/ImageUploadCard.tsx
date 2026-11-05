import { useRef, type ChangeEvent } from 'react';
import { AlertTriangle, Microscope, Upload } from 'lucide-react';
import { AnalysisProgress } from '@/components/screening/AnalysisProgress';
import { Button } from '@/components/common/Button';
import { InlineAlert } from '@/components/common/InlineAlert';
import { ImageDropzone } from '@/components/screening/ImageDropzone';
import { QualityChecksList } from '@/components/screening/QualityChecksList';
import { SelectedImagePanel } from '@/components/screening/SelectedImagePanel';
import { ClientQualityCard } from '@/components/screening/ClientQualityCard';
import { IMAGE_INPUT_ACCEPT } from '@/lib/imageValidation';
import type { AnalysisState } from '@/types/screening';
import type { QualityCheckState } from '@/hooks/useClientQualityCheck';

interface ImageUploadCardProps {
  file: File | null;
  previewUrl: string | null;
  uploadError: string | null;
  analysis: AnalysisState;
  qualityCheck: QualityCheckState;
  onSelectFile: (file: File) => void;
  onClearImage: () => void;
  onAnalyse: () => void;
}

export function ImageUploadCard({
  file,
  previewUrl,
  uploadError,
  analysis,
  qualityCheck,
  onSelectFile,
  onClearImage,
  onAnalyse,
}: ImageUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (selected) onSelectFile(selected);
  }

  const hasImage = file !== null && previewUrl !== null;
  const isBusy = analysis.phase === 'uploading' || analysis.phase === 'analysing';
  const isQualityRejected = analysis.phase === 'quality_rejected';
  const isClientQualityPoor =
    qualityCheck.status === 'ready' && qualityCheck.result.overall === 'poor';

  return (
    <section className="surface-card flex flex-col gap-8 p-6 sm:p-8" aria-labelledby="upload-heading">
      <div>
        <h2 id="upload-heading" className="text-lg font-bold text-neutral-50">
          Retinal image
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          {hasImage
            ? 'Check the preview, then run the analysis when you are ready.'
            : 'Select a fundus photograph from your device to begin.'}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_INPUT_ACCEPT}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {hasImage ? (
        <div className="flex flex-col gap-6">
          <SelectedImagePanel
            key={previewUrl}
            file={file}
            previewUrl={previewUrl}
            isScanning={isBusy}
            onReplace={openFilePicker}
            onRemove={onClearImage}
          />
          <ClientQualityCard state={qualityCheck} />
        </div>
      ) : (
        <ImageDropzone onBrowse={openFilePicker} onFileDrop={onSelectFile} />
      )}

      {uploadError && (
        <InlineAlert tone="error" title="Image not accepted">
          {uploadError}
        </InlineAlert>
      )}

      {hasImage && (
        <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
          {analysis.phase === 'error' && (
            <InlineAlert tone="error" title="Analysis failed">
              {analysis.message}
            </InlineAlert>
          )}
          {isQualityRejected && (
            <div className="flex flex-col gap-5">
              <InlineAlert tone="warning" title="This photograph needs replacing">
                {analysis.message}
              </InlineAlert>
              <QualityChecksList checks={analysis.checks} />
            </div>
          )}
          {(analysis.phase === 'uploading' || analysis.phase === 'analysing') && (
            <AnalysisProgress
              phase={analysis.phase}
              progress={analysis.phase === 'uploading' ? analysis.progress : 1}
            />
          )}
          {isQualityRejected ? (
            <Button size="lg" fullWidth onClick={openFilePicker}>
              <Upload className="h-5 w-5" aria-hidden="true" />
              Choose a different image
            </Button>
          ) : isClientQualityPoor && analysis.phase !== 'complete' ? (
            <div className="flex flex-col gap-4">
              <InlineAlert tone="warning" title="Low image quality detected">
                <span className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-300" aria-hidden="true" />
                  This image may be too low-quality for reliable results. Consider choosing a better photograph, or
                  proceed at your own discretion.
                </span>
              </InlineAlert>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" fullWidth onClick={openFilePicker} disabled={isBusy}>
                  <Upload className="h-5 w-5" aria-hidden="true" />
                  Choose another image
                </Button>
                <Button variant="secondary" size="lg" fullWidth onClick={onAnalyse} disabled={isBusy} aria-busy={isBusy}>
                  <Microscope className="h-5 w-5" aria-hidden="true" />
                  Analyse anyway
                </Button>
              </div>
            </div>
          ) : (
            <Button size="lg" fullWidth onClick={onAnalyse} disabled={isBusy} aria-busy={isBusy}>
              <Microscope className="h-5 w-5" aria-hidden="true" />
              {analysis.phase === 'error' ? 'Try analysis again' : 'Analyse Image'}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
