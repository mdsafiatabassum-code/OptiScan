import { useState, type DragEvent } from 'react';
import { FolderOpen, UploadCloud } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cx } from '@/lib/classNames';
import { MAX_IMAGE_SIZE_MB } from '@/lib/imageValidation';

interface ImageDropzoneProps {
  onBrowse: () => void;
  onFileDrop: (file: File) => void;
}

export function ImageDropzone({ onBrowse, onFileDrop }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) onFileDrop(droppedFile);
  }

  return (
    <div
      role="region"
      aria-label="Retinal image upload area"
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cx(
        'flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-200',
        isDragging ? 'border-brand-500 bg-brand-50' : 'border-navy-200 bg-secondary-50/50',
      )}
    >
      <span
        className={cx(
          'flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300',
          'bg-gradient-to-br from-brand-600 to-accent-500 shadow-brand-600/25',
          isDragging && 'scale-110',
        )}
      >
        <UploadCloud className="h-8 w-8" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-lg font-bold text-navy-900">
        {isDragging ? 'Release to upload your image' : 'Drag and drop your retinal image here'}
      </h3>
      <p className="mt-2 text-sm text-navy-600">or choose a file from your device</p>

      <Button variant="secondary" onClick={onBrowse} className="mt-6">
        <FolderOpen className="h-4 w-4" aria-hidden="true" />
        Browse files
      </Button>

      <p className="mt-6 text-xs text-navy-500">
        JPG, JPEG or PNG. Up to {MAX_IMAGE_SIZE_MB} MB. One image at a time.
      </p>
    </div>
  );
}
