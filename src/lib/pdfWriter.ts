export interface PdfTextRun {
  text: string;
  font: 'regular' | 'bold' | 'mono';
  size: number;
  x: number;
  y: number;
}

export const PDF_PAGE_WIDTH = 595;
export const PDF_PAGE_HEIGHT = 842;

const FONT_RESOURCE: Record<PdfTextRun['font'], string> = { regular: 'F1', bold: 'F2', mono: 'F3' };
const FONT_OBJECT_IDS = { F1: 3, F2: 4, F3: 5 } as const;
const BASE_FONTS = ['Helvetica', 'Helvetica-Bold', 'Courier'] as const;
const FIRST_PAGE_OBJECT_ID = 6;

export function sanitizePdfText(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00D7/g, 'x')
    .replace(/[^\x20-\x7E]/g, '');
}

function escapePdfString(text: string): string {
  return sanitizePdfText(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function pageContentStream(runs: PdfTextRun[]): string {
  return runs
    .map(
      (run) =>
        `BT /${FONT_RESOURCE[run.font]} ${run.size} Tf 1 0 0 1 ${run.x.toFixed(2)} ${run.y.toFixed(2)} Tm ` +
        `(${escapePdfString(run.text)}) Tj ET`,
    )
    .join('\n');
}

function buildObjects(pages: PdfTextRun[][]): string[] {
  const pageIds = pages.map((_, index) => FIRST_PAGE_OBJECT_ID + index * 2);
  const kids = pageIds.map((id) => `${id} 0 R`).join(' ');
  const fontObjects = BASE_FONTS.map(
    (font) => `<< /Type /Font /Subtype /Type1 /BaseFont /${font} /Encoding /WinAnsiEncoding >>`,
  );

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`,
    ...fontObjects,
  ];

  pages.forEach((runs, index) => {
    const contentId = pageIds[index] + 1;
    const stream = pageContentStream(runs);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] ` +
        `/Resources << /Font << /F1 ${FONT_OBJECT_IDS.F1} 0 R /F2 ${FONT_OBJECT_IDS.F2} 0 R /F3 ${FONT_OBJECT_IDS.F3} 0 R >> >> ` +
        `/Contents ${contentId} 0 R >>`,
    );
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  return objects;
}

export function buildPdfBlob(pages: PdfTextRun[][]): Blob {
  const objects = buildObjects(pages);
  let output = '%PDF-1.4\n';
  const offsets: number[] = [];

  objects.forEach((body, index) => {
    offsets.push(output.length);
    output += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    output += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new Blob([output], { type: 'application/pdf' });
}
