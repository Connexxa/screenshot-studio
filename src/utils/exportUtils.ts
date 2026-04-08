import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { StoreFormat, DeviceFrame, TextOverlay, BackgroundConfig, UploadedImage } from '../types';
import { renderScreenshot, loadImage, canvasToBlob } from './imageProcessor';

export interface ExportResult {
  format: StoreFormat;
  imageIndex: number;
  blob: Blob;
  filename: string;
}

/**
 * Export all images for all selected formats
 */
export async function exportAll(
  images: UploadedImage[],
  formats: StoreFormat[],
  frame: DeviceFrame | null,
  textOverlay: TextOverlay,
  background: BackgroundConfig,
  padding: number,
  onProgress?: (current: number, total: number) => void
): Promise<ExportResult[]> {
  const results: ExportResult[] = [];
  const total = images.length * formats.length;
  let current = 0;

  for (const format of formats) {
    for (let i = 0; i < images.length; i++) {
      const img = await loadImage(images[i].url);
      const canvas = await renderScreenshot(img, format, frame, textOverlay, background, padding);
      const blob = await canvasToBlob(canvas, 'png');

      results.push({
        format,
        imageIndex: i,
        blob,
        filename: `screenshot_${String(i + 1).padStart(2, '0')}.png`,
      });

      current++;
      onProgress?.(current, total);
    }
  }

  return results;
}

/**
 * Download all exports as a ZIP file with organized folder structure
 */
export async function downloadAsZip(
  results: ExportResult[],
  projectName: string = 'screenshots'
): Promise<void> {
  const zip = new JSZip();

  for (const result of results) {
    const storeName = result.format.store === 'apple' ? 'apple-appstore' : 'google-playstore';
    const categoryName = result.format.category.toLowerCase().replace(/\s+/g, '-');
    const formatName = result.format.id.replace(`${result.format.store}-`, '');

    const path = `${storeName}/${categoryName}/${formatName}/${result.filename}`;
    zip.file(path, result.blob);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}_${new Date().toISOString().slice(0, 10)}.zip`);
}

/**
 * Download a single image
 */
export function downloadSingle(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

/**
 * Save project configuration
 */
export function saveProjectConfig(config: object, name: string) {
  const json = JSON.stringify(config, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${name}_config.json`);
}
