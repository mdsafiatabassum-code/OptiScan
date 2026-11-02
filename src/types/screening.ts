export interface ClassProbability {
  index: number;
  label: string;
  probability: number;
}

export interface QualityCheck {
  code: string;
  label: string;
  status: 'passed' | 'failed';
  value: number;
  message: string;
}

export interface ScreeningReport {
  reportId: string;
  generatedAt: string;
  model: {
    name: string;
    version: string;
    source: string;
    license: string;
    intendedUse: string;
  };
  predictedGrade: {
    index: number;
    label: string;
    clinicalScale: string;
    description: string;
  };
  probabilities: ClassProbability[];
  explanation: string;
  limitations: string[];
  nextSteps: string[];
  disclaimer: string;
  image: {
    format: string;
    sizeBytes: number;
    width: number;
    height: number;
  };
  quality: {
    status: 'passed';
    checks: QualityCheck[];
    note: string;
  };
  explainability: {
    status: 'pending';
    method: null;
    note: string;
  };
}

export type AnalysisState =
  | { phase: 'idle' }
  | { phase: 'uploading'; progress: number }
  | { phase: 'analysing' }
  | { phase: 'complete'; report: ScreeningReport }
  | { phase: 'quality_rejected'; message: string; checks: QualityCheck[] }
  | { phase: 'error'; message: string };
