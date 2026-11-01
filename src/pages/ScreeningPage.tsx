import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ImageUploadCard } from '@/components/screening/ImageUploadCard';
import { ResultsView } from '@/components/screening/ResultsView';
import { ScreeningInstructions } from '@/components/screening/ScreeningInstructions';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';
import { Link } from '@/lib/router';

export function ScreeningPage() {
  const flow = useScreeningFlow();

  useEffect(() => {
    document.title = 'Retinal Screening | OptiScan';
  }, []);

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-navy-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <header className="mt-6 max-w-2xl animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Retinal Screening</h1>
          <p className="mt-3 text-base text-navy-600 sm:text-lg">
            Upload a retinal fundus photograph (JPG, JPEG or PNG) and the AI screening model will return a screening
            estimate with the probabilities it produced, plain-language guidance and next steps.
          </p>
        </header>

        <div className="mt-10">
          {flow.analysis.phase === 'complete' && flow.previewUrl ? (
            <ResultsView
              report={flow.analysis.report}
              previewUrl={flow.previewUrl}
              onAnalyseAnother={flow.clearImage}
            />
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
        </div>
      </div>
    </PageLayout>
  );
}
