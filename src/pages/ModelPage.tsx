import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { InlineAlert } from '@/components/common/InlineAlert';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ModelDetails } from '@/components/model/ModelDetails';
import { MODEL_LIMITATIONS } from '@/config/modelInfo';

export function ModelPage() {
  useEffect(() => {
    document.title = 'About the Model | OptiScan';
  }, []);

  return (
    <DashboardLayout
      title="About the model"
      description="The pretrained network behind OptiScan, what it outputs and where it falls short."
    >
      <div className="flex flex-col gap-6">
        <ModelDetails />

        <section className="surface-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-neutral-50">Limitations</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {MODEL_LIMITATIONS.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-300" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <InlineAlert tone="info" title="Research prototype">
          OptiScan is not a medical device and has not been clinically validated. Do not use its outputs as a diagnosis.
        </InlineAlert>
      </div>
    </DashboardLayout>
  );
}
