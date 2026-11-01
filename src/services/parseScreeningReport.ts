import type { ScreeningReport } from '@/types/screening';

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readObject(source: JsonObject, key: string): JsonObject {
  const value = source[key];
  if (!isObject(value)) throw new TypeError(`Expected object for ${key}`);
  return value;
}

function readString(source: JsonObject, key: string): string {
  const value = source[key];
  if (typeof value !== 'string') throw new TypeError(`Expected string for ${key}`);
  return value;
}

function readNumber(source: JsonObject, key: string): number {
  const value = source[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`Expected number for ${key}`);
  return value;
}

function readStringArray(source: JsonObject, key: string): string[] {
  const value = source[key];
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new TypeError(`Expected string list for ${key}`);
  }
  return value;
}

function readProbabilities(source: JsonObject): ScreeningReport['probabilities'] {
  const value = source.probabilities;
  if (!Array.isArray(value) || value.length === 0) throw new TypeError('Expected probabilities list');
  return value.map((item) => {
    if (!isObject(item)) throw new TypeError('Expected probability entry');
    const probability = readNumber(item, 'probability');
    if (probability < 0 || probability > 1) throw new RangeError('Probability outside 0-1');
    return {
      index: readNumber(item, 'index'),
      label: readString(item, 'label'),
      probability,
    };
  });
}

export function parseScreeningReport(payload: unknown): ScreeningReport {
  if (!isObject(payload)) throw new TypeError('Report is not an object');
  if (payload.status !== 'completed') throw new TypeError('Report is not completed');

  const generatedAt = readString(payload, 'generatedAt');
  if (Number.isNaN(Date.parse(generatedAt))) throw new TypeError('Invalid report timestamp');

  const model = readObject(payload, 'model');
  const grade = readObject(payload, 'predictedGrade');
  const image = readObject(payload, 'image');
  const explainability = readObject(payload, 'explainability');
  if (explainability.status !== 'pending') throw new TypeError('Unexpected explainability status');

  return {
    reportId: readString(payload, 'reportId'),
    generatedAt,
    model: {
      name: readString(model, 'name'),
      version: readString(model, 'version'),
      source: readString(model, 'source'),
      license: readString(model, 'license'),
      intendedUse: readString(model, 'intendedUse'),
    },
    predictedGrade: {
      index: readNumber(grade, 'index'),
      label: readString(grade, 'label'),
      clinicalScale: readString(grade, 'clinicalScale'),
      description: readString(grade, 'description'),
    },
    probabilities: readProbabilities(payload),
    explanation: readString(payload, 'explanation'),
    limitations: readStringArray(payload, 'limitations'),
    nextSteps: readStringArray(payload, 'nextSteps'),
    disclaimer: readString(payload, 'disclaimer'),
    image: {
      format: readString(image, 'format'),
      sizeBytes: readNumber(image, 'sizeBytes'),
      width: readNumber(image, 'width'),
      height: readNumber(image, 'height'),
    },
    explainability: {
      status: 'pending',
      method: null,
      note: readString(explainability, 'note'),
    },
  };
}
