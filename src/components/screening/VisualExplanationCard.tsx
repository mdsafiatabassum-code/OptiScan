import { Layers } from 'lucide-react';
import { ResultCard } from '@/components/screening/ResultCard';

interface VisualExplanationCardProps {
  previewUrl: string;
  note: string;
}

export function VisualExplanationCard({ previewUrl, note }: VisualExplanationCardProps) {
  return (
    <ResultCard icon={Layers} title="Original image" badge="Heatmap pending">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-canvas">
          <img
            src={previewUrl}
            alt="Your uploaded retinal photograph"
            className="max-h-80 w-full object-contain"
          />
        </div>
        <p className="text-sm leading-relaxed text-neutral-400">{note}</p>
      </div>
    </ResultCard>
  );
}
