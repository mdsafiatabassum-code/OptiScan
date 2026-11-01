import { Layers } from 'lucide-react';
import { ResultCard } from '@/components/screening/ResultCard';

interface VisualExplanationCardProps {
  previewUrl: string;
  note: string;
}

export function VisualExplanationCard({ previewUrl, note }: VisualExplanationCardProps) {
  return (
    <ResultCard icon={Layers} title="Visual explanation" badge="Heatmap pending" className="lg:col-span-2">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-navy-900">
          <img src={previewUrl} alt="Your uploaded retinal photograph" className="h-full w-full object-contain" />
        </div>
        <div className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-navy-200 bg-secondary-50/60 p-6 text-center">
          <Layers className="h-8 w-8 text-navy-400" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-800">Heatmap pending</p>
          <p className="mt-2 max-w-xs text-sm text-navy-600">{note}</p>
        </div>
      </div>
    </ResultCard>
  );
}
