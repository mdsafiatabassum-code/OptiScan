export type QualityLevel = 'good' | 'fair' | 'poor';
export type OverallQuality = 'good' | 'acceptable' | 'poor';

export interface QualityMetric {
  level: QualityLevel;
  value: number;
  unit: string;
  tip: string;
}

export interface ClientQualityResult {
  sharpness: QualityMetric;
  lighting: QualityMetric;
  resolution: QualityMetric;
  overall: OverallQuality;
}

const RESOLUTION_GOOD = 512;
const RESOLUTION_FAIR = 256;

const BRIGHTNESS_GOOD_MIN = 40;
const BRIGHTNESS_GOOD_MAX = 220;
const BRIGHTNESS_FAIR_MIN = 20;
const BRIGHTNESS_FAIR_MAX = 240;

const SHARPNESS_GOOD = 100;
const SHARPNESS_FAIR = 30;

const MAX_ANALYSIS_SIZE = 256;

function classifyResolution(shorterSide: number): QualityMetric {
  if (shorterSide >= RESOLUTION_GOOD) {
    return { level: 'good', value: shorterSide, unit: 'px', tip: 'Resolution is sufficient for analysis.' };
  }
  if (shorterSide >= RESOLUTION_FAIR) {
    return { level: 'fair', value: shorterSide, unit: 'px', tip: 'Resolution is low. A higher-resolution image may improve results.' };
  }
  return { level: 'poor', value: shorterSide, unit: 'px', tip: 'Resolution is too low. Use an image at least 512px on the shorter side.' };
}

function classifyBrightness(meanLuminance: number): QualityMetric {
  if (meanLuminance >= BRIGHTNESS_GOOD_MIN && meanLuminance <= BRIGHTNESS_GOOD_MAX) {
    return { level: 'good', value: Math.round(meanLuminance), unit: '/255', tip: 'Lighting is well-balanced.' };
  }
  if (meanLuminance >= BRIGHTNESS_FAIR_MIN && meanLuminance <= BRIGHTNESS_FAIR_MAX) {
    const tip = meanLuminance < BRIGHTNESS_GOOD_MIN ? 'Image is dim. Better lighting may improve results.' : 'Image is bright. Slightly lower exposure may help.';
    return { level: 'fair', value: Math.round(meanLuminance), unit: '/255', tip };
  }
  const tip = meanLuminance < BRIGHTNESS_FAIR_MIN ? 'Image is too dark for reliable analysis.' : 'Image is too bright (overexposed).';
  return { level: 'poor', value: Math.round(meanLuminance), unit: '/255', tip };
}

function classifySharpness(laplacianVariance: number): QualityMetric {
  if (laplacianVariance >= SHARPNESS_GOOD) {
    return { level: 'good', value: Math.round(laplacianVariance), unit: '', tip: 'Image is sharp.' };
  }
  if (laplacianVariance >= SHARPNESS_FAIR) {
    return { level: 'fair', value: Math.round(laplacianVariance), unit: '', tip: 'Image may be slightly blurred. A sharper photo could help.' };
  }
  return { level: 'poor', value: Math.round(laplacianVariance), unit: '', tip: 'Image appears blurred. Use a sharper photograph.' };
}

function computeOverall(metrics: QualityMetric[]): OverallQuality {
  if (metrics.some((m) => m.level === 'poor')) return 'poor';
  if (metrics.some((m) => m.level === 'fair')) return 'acceptable';
  return 'good';
}

function toGrayscale(data: Uint8ClampedArray, width: number, height: number): Float32Array {
  const gray = new Float32Array(width * height);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return gray;
}

function computeMeanLuminance(gray: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < gray.length; i++) sum += gray[i];
  return sum / gray.length;
}

function computeLaplacianVariance(gray: Float32Array, width: number, height: number): number {
  const laplacian = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const center = gray[idx];
      const top = gray[idx - width];
      const bottom = gray[idx + width];
      const left = gray[idx - 1];
      const right = gray[idx + 1];
      laplacian[idx] = top + bottom + left + right - 4 * center;
    }
  }
  let mean = 0;
  const count = (width - 2) * (height - 2);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      mean += laplacian[y * width + x];
    }
  }
  mean /= count;
  let variance = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const diff = laplacian[y * width + x] - mean;
      variance += diff * diff;
    }
  }
  return variance / count;
}

export function analyzeImageQuality(
  imageData: ImageData,
  naturalWidth: number,
  naturalHeight: number,
): ClientQualityResult {
  const { data, width, height } = imageData;
  const gray = toGrayscale(data, width, height);
  const meanLuminance = computeMeanLuminance(gray);
  const laplacianVariance = computeLaplacianVariance(gray, width, height);
  const shorterSide = Math.min(naturalWidth, naturalHeight);

  const sharpness = classifySharpness(laplacianVariance);
  const lighting = classifyBrightness(meanLuminance);
  const resolution = classifyResolution(shorterSide);
  const overall = computeOverall([sharpness, lighting, resolution]);

  return { sharpness, lighting, resolution, overall };
}

export async function runQualityCheck(
  imgSource: HTMLImageElement,
): Promise<ClientQualityResult> {
  const naturalWidth = imgSource.naturalWidth;
  const naturalHeight = imgSource.naturalHeight;
  const scale = Math.min(1, MAX_ANALYSIS_SIZE / Math.max(naturalWidth, naturalHeight));
  const canvasWidth = Math.max(1, Math.round(naturalWidth * scale));
  const canvasHeight = Math.max(1, Math.round(naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context is not available.');
  ctx.drawImage(imgSource, 0, 0, canvasWidth, canvasHeight);
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  return analyzeImageQuality(imageData, naturalWidth, naturalHeight);
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for quality check.'));
    img.src = src;
  });
}
