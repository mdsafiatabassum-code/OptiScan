import { useEffect, useState } from 'react';
import { Clock, Eye, History as HistoryIcon, Trash2, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { InlineAlert } from '@/components/common/InlineAlert';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResultsView } from '@/components/screening/ResultsView';
import { useHistory } from '@/hooks/useHistory';
import { formatReportTimestamp } from '@/lib/reportFormat';
import { formatPercent } from '@/lib/reportFormat';
import type { HistoryItem } from '@/lib/history';
import type { ScreeningReport } from '@/types/screening';

function parseReport(json: string): ScreeningReport | null {
  try {
    const parsed = JSON.parse(json) as ScreeningReport;
    if (parsed && parsed.reportId && parsed.predictedGrade) return parsed;
    return null;
  } catch {
    return null;
  }
}

function HistoryRow({
  item,
  onOpen,
  onDelete,
}: {
  item: HistoryItem;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const topProb = item.probabilities[item.predictedIndex];
  const topPercent = topProb ? formatPercent(topProb.probability) : '--';

  return (
    <div className="surface-card flex items-center gap-4 p-4">
      <img
        src={item.thumbnail}
        alt="Retinal photograph thumbnail"
        className="h-14 w-14 shrink-0 rounded-lg border border-white/10 object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-neutral-50">{item.predictedLabel}</span>
        <span className="text-xs text-neutral-400">{formatReportTimestamp(item.timestamp)}</span>
        <span className="text-xs text-neutral-400">Top score: {topPercent}</span>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open screening result"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 hover:bg-white/5 hover:text-primary-200"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete screening from history"
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-neutral-300 hover:bg-white/5 hover:text-danger-300"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function HistoryPage() {
  const history = useHistory();
  const [confirmClear, setConfirmClear] = useState(false);
  const [openedItem, setOpenedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    document.title = 'Screening History | OptiScan';
  }, []);

  const openedReport = openedItem ? parseReport(openedItem.reportJson) : null;

  if (openedItem && openedReport) {
    return (
      <DashboardLayout
        title="Past screening result"
        description="A stored screening result from your device history."
      >
        <div className="flex flex-col gap-6">
          <Button variant="secondary" onClick={() => setOpenedItem(null)} className="w-fit">
            <X className="h-4 w-4" aria-hidden="true" />
            Back to history
          </Button>
          <ResultsView
            report={openedReport}
            previewUrl={openedItem.thumbnail}
            onAnalyseAnother={() => setOpenedItem(null)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Screening history"
      description="Past screening results stored on this device."
    >
      <div className="flex flex-col gap-6">
        <InlineAlert tone="info" title="Device-only storage">
          History is stored only on this device. Clearing your browser data will remove all saved screenings.
        </InlineAlert>

        {history.items.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-4 p-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-200 ring-1 ring-inset ring-primary-300/20">
              <HistoryIcon className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-bold text-neutral-50">No screenings yet</h2>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
              When you complete a screening, it will appear here with a thumbnail, date and result summary.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-sm text-neutral-400">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {history.items.length} {history.items.length === 1 ? 'screening' : 'screenings'}
              </p>
              {confirmClear ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-300">Delete all?</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      history.clear();
                      setConfirmClear(false);
                    }}
                  >
                    Yes, clear all
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {history.items.map((item) => (
                <HistoryRow
                  key={item.id}
                  item={item}
                  onOpen={() => setOpenedItem(item)}
                  onDelete={() => history.remove(item.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
