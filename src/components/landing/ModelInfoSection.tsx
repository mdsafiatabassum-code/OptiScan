import { SectionHeader } from '@/components/common/SectionHeader';
import { ModelDetails } from '@/components/model/ModelDetails';

export function ModelInfoSection() {
  return (
    <section id="model" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="The model"
          title="A pretrained ResNet34 network, grading five severity levels"
          description="OptiScan runs an open pretrained model on your image. Its scores describe how the model classifies the photograph, not a confirmed clinical finding."
        />
        <div className="mt-14">
          <ModelDetails />
        </div>
      </div>
    </section>
  );
}
