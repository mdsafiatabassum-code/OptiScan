export const GRADE_SCALE = [
  { index: 0, label: 'No DR' },
  { index: 1, label: 'Mild' },
  { index: 2, label: 'Moderate' },
  { index: 3, label: 'Severe' },
  { index: 4, label: 'Proliferative' },
] as const;

export const MODEL_FACTS = [
  { label: 'Architecture', value: 'ResNet34 convolutional neural network' },
  { label: 'Pretrained model', value: 'fundusnap/fundusnap-v1-severitycls-rn34-22m' },
  { label: 'Output', value: 'Five diabetic retinopathy severity grades with raw class scores' },
  {
    label: 'Input preparation',
    value: 'Resized to 224 pixels on the shorter side, centre-cropped to 224 × 224 and normalised',
  },
  { label: 'Licence', value: 'CC BY-NC 4.0 (non-commercial use)' },
  { label: 'Explainability', value: 'Visual heatmap not yet implemented' },
] as const;

export const SCREENING_BENEFITS = [
  'Extends screening reach to clinics and communities without nearby specialists.',
  'Provides a consistent first-pass review to support busy healthcare teams.',
  'Can help prioritise which patients should be referred for specialist review sooner.',
  'Supports healthcare workers with clear, structured information to discuss with patients.',
];

export const MODEL_LIMITATIONS = [
  'A screening aid, not a diagnosis. Clinical decisions remain with qualified professionals.',
  'Results depend on image quality. Blurred, dark or partial photographs may be unreliable.',
  'No AI system detects every case. Negative outputs must not be treated as reassurance.',
  'Any model must be validated on local populations and equipment before routine use.',
  'Raw class scores are uncalibrated and do not measure how certain a diagnosis is.',
];
