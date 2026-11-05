import { useCallback, useEffect, useRef } from 'react';
import { ImageUploadCard } from '@/components/screening/ImageUploadCard';
import { ResultsView } from '@/components/screening/ResultsView';
import { ScreeningInstructions } from '@/components/screening/ScreeningInstructions';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';
import { useClientQualityCheck } from '@/hooks/useClientQualityCheck';
import { useHistory } from '@/hooks/useHistory';
import { generateThumbnail } from '@/lib/history';
import type { ScreeningReport } from '@/types/screening';

export function ScreeningPage() {
  const history = useHistory();
  const previewUrlRef = useRef<string | null>(null);

  const handleComplete = useCallback(
    async (report: ScreeningReport) => {
      const previewUrl = previewUrlRef.current;
      if (!previewUrl) return;
      try {
        const thumbnail = await generateThumbnail(previewUrl);
        history.add({
          id: crypto.randomUUID(),
          timestamp: report.generatedAt,
          predictedLabel: report.predictedGrade.label,
          predictedIndex: report.predictedGrade.index,
          probabilities: report.probabilities,
          qualityStatus: report.quality.status,
          thumbnail,
          reportId: report.reportId,
          reportJson: JSON.stringify(report),
        });
      } catch {
        // thumbnail generation failed — skip history save silently
      }
    },
    [history],
  );

  const flow = useScreeningFlow(handleComplete);
  previewUrlRef.current = flow.previewUrl;

  const qualityCheck = useClientQualityCheck(flow.previewUrl);

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
            qualityCheck={qualityCheck}
            onSelectFile={flow.selectFile}
            onClearImage={flow.clearImage}
            onAnalyse={flow.analyse}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
