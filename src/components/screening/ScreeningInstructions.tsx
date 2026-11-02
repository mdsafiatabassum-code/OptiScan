import { CheckCircle2 } from 'lucide-react';
import { InlineAlert } from '@/components/common/InlineAlert';
import { ACCEPTED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE_MB } from '@/lib/imageValidation';

const requirements = [
  'Use a retinal fundus photograph taken with a fundus camera.',
  `Accepted formats: ${ACCEPTED_IMAGE_EXTENSIONS.map((extension) => extension.toUpperCase().slice(1)).join(', ')}.`,
  `Maximum file size: ${MAX_IMAGE_SIZE_MB} MB.`,
  'Make sure the image is sharp, evenly lit and shows the full retina, including the optic disc.',
  'Analyse one image at a time.',
];

export function ScreeningInstructions() {
  return (
    <aside className="surface-card flex flex-col gap-6 p-6 sm:p-8 lg:sticky lg:top-24">
      <div>
        <h2 className="text-lg font-bold text-neutral-50">Before you begin</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          Good image quality makes a real difference. Follow these guidelines when preparing your photograph.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {requirements.map((text) => (
          <li key={text} className="flex gap-3 text-sm leading-relaxed text-neutral-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>

      <InlineAlert tone="info" title="Your image is sent for analysis">
        The photograph is sent to the analysis server for this request only. OptiScan does not create a patient record.
      </InlineAlert>
    </aside>
  );
}
