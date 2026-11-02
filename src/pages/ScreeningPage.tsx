import { useEffect } from 'react';
import { ImageUploadCard } from '@/components/screening/ImageUploadCard';
import { ResultsView } from '@/components/screening/ResultsView';
import { ScreeningInstructions } from '@/components/screening/ScreeningInstructions';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';

export function ScreeningPage() {
  const flow = useScreeningFlow();

  useEffect(() => {
    document.title = 'New Screening | OptiScan';
  }, []);

  return (
    <DashboardLayout
      title="New screening"
      description="Upload a retinal fundus photograph to receive a model-generated screening estimate, with quality checks, raw class scores and next steps."
    >
      {flow.analysis.phase === 'complete' && flow.previewUrl ? (
        <ResultsView report={flow.analysis.report} previewUrl={flow.previewUrl} onAnalyseAnother={flow.clearImage} />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <ScreeningInstructions />
          <ImageUploadCard
            file={flow.file}
            previewUrl={flow.previewUrl}
            uploadError={flow.uploadError}
            analysis={flow.analysis}
            onSelectFile={flow.selectFile}
            onClearImage={flow.clearImage}
            onAnalyse={flow.analyse}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
