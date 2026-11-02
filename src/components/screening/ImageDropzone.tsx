import { useState, type DragEvent } from 'react';
import { FolderOpen, FileImage, HardDrive, UploadCloud } from 'lucide-react';
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
        'flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center transition-all duration-300 sm:py-20',
        isDragging
          ? 'border-primary-300 bg-primary-400/10 shadow-glow'
          : 'border-white/15 bg-white/[0.02] hover:border-primary-300/40 hover:bg-white/[0.04]',
      )}
    >
      <span
        className={cx(
          'flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-300/25 bg-gradient-to-br from-primary-400/20 to-secondary-500/20 text-primary-100 shadow-glow transition-transform duration-300',
          isDragging && 'scale-110',
        )}
      >
        <UploadCloud className="h-9 w-9" aria-hidden="true" />
      </span>

      <h3 className="mt-7 text-xl font-bold text-neutral-50">
        {isDragging ? 'Release to upload your image' : 'Drag and drop your retinal image'}
      </h3>
      <p className="mt-2 text-sm text-neutral-400">or select a file from your device</p>

      <Button size="lg" onClick={onBrowse} className="mt-7">
        <FolderOpen className="h-5 w-5" aria-hidden="true" />
        Browse Files
      </Button>

      <ul className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-neutral-400">
        <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <FileImage className="h-3.5 w-3.5" aria-hidden="true" />
          JPG, JPEG or PNG
        </li>
        <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
          Up to {MAX_IMAGE_SIZE_MB} MB
        </li>
        <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1">One image at a time</li>
      </ul>
    </div>
  );
}
