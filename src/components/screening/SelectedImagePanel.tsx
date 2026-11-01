import { useState } from 'react';
import { CheckCircle2, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatFileSize } from '@/lib/imageValidation';

interface SelectedImagePanelProps {
  file: File;
  previewUrl: string;
  onReplace: () => void;
  onRemove: () => void;
}

export function SelectedImagePanel({ file, previewUrl, onReplace, onRemove }: SelectedImagePanelProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const formatLabel = file.type === 'image/png' ? 'PNG' : 'JPEG';

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-navy-900">
        <img
          src={previewUrl}
          alt="Preview of the selected retinal photograph"
          onLoad={(event) =>
            setDimensions({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })
          }
          className="h-full w-full animate-fade-in object-contain"
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy-900" title={file.name}>
            {file.name}
          </p>
          <p className="mt-1 text-sm text-navy-600">
            {formatLabel} · {formatFileSize(file.size)}
            {dimensions && ` · ${dimensions.width} × ${dimensions.height} px`}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-800">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          Ready
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="secondary" onClick={onReplace}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Replace image
        </Button>
        <Button variant="danger" onClick={onRemove}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove image
        </Button>
      </div>
    </div>
  );
}
