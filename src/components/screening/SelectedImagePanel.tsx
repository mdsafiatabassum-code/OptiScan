import { useState } from 'react';
import { CheckCircle2, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatFileSize } from '@/lib/imageValidation';

interface SelectedImagePanelProps {
  file: File;
  previewUrl: string;
  isScanning: boolean;
  onReplace: () => void;
  onRemove: () => void;
}

export function SelectedImagePanel({ file, previewUrl, isScanning, onReplace, onRemove }: SelectedImagePanelProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const formatLabel = file.type === 'image/png' ? 'PNG' : 'JPEG';

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-canvas">
        <img
          src={previewUrl}
          alt="Preview of the selected retinal photograph"
          onLoad={(event) =>
            setDimensions({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })
          }
          className="h-full max-h-[28rem] w-full animate-fade-in object-contain"
        />
        {isScanning && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-primary-200/35 to-transparent"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success-400/10 px-3 py-1 text-xs font-semibold text-success-200 ring-1 ring-inset ring-success-400/25">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Ready for analysis
          </span>
          <p className="break-all text-base font-semibold text-neutral-50" title={file.name}>
            {file.name}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">Format</dt>
            <dd className="mt-1 text-sm font-semibold text-neutral-50">{formatLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">File size</dt>
            <dd className="mt-1 text-sm font-semibold text-neutral-50">{formatFileSize(file.size)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">Dimensions</dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-neutral-50">
              {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Reading image…'}
            </dd>
          </div>
        </dl>

        <div className="mt-auto grid gap-3 sm:grid-cols-2 md:grid-cols-1">
          <Button variant="secondary" onClick={onReplace} disabled={isScanning}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Replace image
          </Button>
          <Button variant="danger" onClick={onRemove} disabled={isScanning}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Remove image
          </Button>
        </div>
      </div>
    </div>
  );
}
