import { formatFileSize } from '@/lib/imageValidation';
import { PDF_PAGE_HEIGHT, PDF_PAGE_WIDTH, buildPdfBlob, type PdfTextRun } from '@/lib/pdfWriter';
import { formatPercent, formatReportTimestamp } from '@/lib/reportFormat';
import type { ScreeningReport } from '@/types/screening';

const MARGIN = 56;
const CONTENT_WIDTH = PDF_PAGE_WIDTH - MARGIN * 2;
const TOP_Y = PDF_PAGE_HEIGHT - 64;
const BOTTOM_Y = 80;
const CHAR_WIDTH_RATIO = { regular: 0.52, bold: 0.56, mono: 0.6 } as const;

type Font = PdfTextRun['font'];

function createLayout() {
  const pages: PdfTextRun[][] = [[]];
  let y = TOP_Y;

  function newPageIfNeeded(height: number) {
    if (y - height < BOTTOM_Y) {
      pages.push([]);
      y = TOP_Y;
    }
  }

  function wrap(text: string, font: Font, size: number, width: number): string[] {
    const maxChars = Math.max(1, Math.floor(width / (size * CHAR_WIDTH_RATIO[font])));
    const lines: string[] = [];
    let current = '';
    for (const word of text.split(/\s+/).filter(Boolean)) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    return lines.length > 0 ? lines : [''];
  }

  function text(
    value: string,
    options: { font?: Font; size?: number; indent?: number; gapAfter?: number } = {},
  ) {
    const font = options.font ?? 'regular';
    const size = options.size ?? 10;
    const indent = options.indent ?? 0;
    const lineHeight = size * 1.5;
    const lines = wrap(value, font, size, CONTENT_WIDTH - indent);
    for (const line of lines) {
      newPageIfNeeded(lineHeight);
      pages[pages.length - 1].push({ text: line, font, size, x: MARGIN + indent, y });
      y -= lineHeight;
    }
    y -= options.gapAfter ?? 0;
  }

  function heading(value: string) {
    newPageIfNeeded(40);
    y -= 14;
    text(value, { font: 'bold', size: 12, gapAfter: 4 });
  }

  function field(label: string, value: string) {
    text(`${label}: ${value}`, { gapAfter: 2 });
  }

  function bullets(items: string[], prefix: (index: number) => string) {
    items.forEach((item, index) => text(`${prefix(index)} ${item}`, { indent: 14, gapAfter: 3 }));
  }

  return { pages, text, heading, field, bullets };
}

function addFooters(pages: PdfTextRun[][], reportId: string) {
  pages.forEach((runs, index) => {
    runs.push({
      text: `OptiScan research prototype. Not a diagnosis.   Reference ${reportId}   Page ${index + 1} of ${pages.length}`,
      font: 'regular',
      size: 8,
      x: MARGIN,
      y: 36,
    });
  });
}

export function createReportPdf(report: ScreeningReport): Blob {
  const layout = createLayout();

  layout.text('OptiScan screening report', { font: 'bold', size: 18, gapAfter: 6 });
  layout.text(
    'Research prototype. This is an automated screening estimate from one photograph, not a diagnosis.',
    { size: 10, gapAfter: 10 },
  );
  layout.field('Reference ID', report.reportId);
  layout.field('Generated', formatReportTimestamp(report.generatedAt));
  layout.field('Model', `${report.model.name} (${report.model.version})`);
  layout.field('Licence', report.model.license);

  layout.heading('Screening result');
  layout.text(`${report.predictedGrade.label} (${report.predictedGrade.clinicalScale} grade ${report.predictedGrade.index})`, {
    font: 'bold',
    size: 13,
    gapAfter: 4,
  });
  layout.text(report.predictedGrade.description, { gapAfter: 4 });
  layout.text(report.explanation);

  layout.heading('Class scores (raw model output, not calibrated)');
  report.probabilities.forEach((item) => {
    const bar = '#'.repeat(Math.round(item.probability * 40));
    layout.text(
      `${item.label.padEnd(12)}${formatPercent(item.probability).padStart(7)}  ${bar}`,
      { font: 'mono', size: 9, gapAfter: 1 },
    );
  });

  layout.heading('Image details');
  layout.field('Format', report.image.format);
  layout.field('Dimensions', `${report.image.width} x ${report.image.height} px`);
  layout.field('File size', formatFileSize(report.image.sizeBytes));

  layout.heading('Image quality (preliminary technical checks)');
  report.quality.checks.forEach((check) => {
    layout.text(`${check.label}: ${check.status === 'passed' ? 'Passed' : 'Needs attention'}`, { font: 'bold', gapAfter: 1 });
    layout.text(check.message, { indent: 14, gapAfter: 4 });
  });
  layout.text(report.quality.note, { size: 9, gapAfter: 4 });

  layout.heading('Visual explanation');
  layout.text(report.explainability.note);

  layout.heading('Limitations');
  layout.bullets(report.limitations, () => '-');

  layout.heading('Recommended next steps');
  layout.bullets(report.nextSteps, (index) => `${index + 1}.`);

  layout.heading('Model information');
  layout.field('Source', report.model.source);
  layout.field('Intended use', report.model.intendedUse);

  layout.heading('Disclaimer');
  layout.text(report.disclaimer, { font: 'bold' });

  addFooters(layout.pages, report.reportId);
  return buildPdfBlob(layout.pages);
}
