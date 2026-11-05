import type { ClassProbability } from '@/types/screening';

export interface HistoryItem {
  id: string;
  timestamp: string;
  predictedLabel: string;
  predictedIndex: number;
  probabilities: ClassProbability[];
  qualityStatus: string;
  thumbnail: string;
  heatmap?: string;
  reportId: string;
  reportJson: string;
}

const STORAGE_KEY = 'optiscan:history';
const MAX_ITEMS = 50;
const THUMBNAIL_MAX_SIZE = 120;

export function generateThumbnail(src: string, maxSize = THUMBNAIL_MAX_SIZE): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
    img.src = src;
  });
}

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryItem);
  } catch {
    return [];
  }
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.predictedLabel === 'string' &&
    typeof obj.predictedIndex === 'number' &&
    Array.isArray(obj.probabilities) &&
    typeof obj.qualityStatus === 'string' &&
    typeof obj.thumbnail === 'string' &&
    typeof obj.reportId === 'string' &&
    typeof obj.reportJson === 'string'
  );
}

export function saveHistoryItem(item: HistoryItem): HistoryItem[] {
  const items = loadHistory();
  items.unshift(item);
  const trimmed = items.slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // storage full — keep the in-memory list but drop the oldest until it fits
    while (trimmed.length > 1) {
      trimmed.pop();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        break;
      } catch {
        // continue trimming
      }
    }
  }
  return trimmed;
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  const items = loadHistory().filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
  return items;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getHistoryItem(id: string): HistoryItem | null {
  return loadHistory().find((item) => item.id === id) ?? null;
}
