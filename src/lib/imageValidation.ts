export const MAX_IMAGE_SIZE_MB = 10;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const;
export const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const;
export const IMAGE_INPUT_ACCEPT = 'image/jpeg,image/png,.jpg,.jpeg,.png';

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File): string | null {
  const dotIndex = file.name.lastIndexOf('.');
  const extension = dotIndex >= 0 ? file.name.slice(dotIndex).toLowerCase() : '';
  const isAcceptedType = (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
  const isAcceptedExtension = (ACCEPTED_IMAGE_EXTENSIONS as readonly string[]).includes(extension);

  if (!isAcceptedType || !isAcceptedExtension) {
    return 'Unsupported file type. Please choose a JPG, JPEG, or PNG image.';
  }
  if (file.size === 0) {
    return 'This file is empty. Please choose a different image.';
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `This image is ${formatFileSize(file.size)}. The maximum allowed size is ${MAX_IMAGE_SIZE_MB} MB.`;
  }
  return null;
}
