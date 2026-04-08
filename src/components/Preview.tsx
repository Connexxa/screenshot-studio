import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import type { TextOverlay, BackgroundConfig, UploadedImage } from '../types';
import { renderScreenshot, loadImage } from '../utils/imageProcessor';
import { storeFormats } from '../data/storeFormats';
import { deviceFrames } from '../data/deviceFrames';

interface Props {
  images: UploadedImage[];
  selectedFormats: string[];
  selectedFrameId: string | null;
  textOverlay: TextOverlay;
  background: BackgroundConfig;
  padding: number;
}

export function Preview({
  images,
  selectedFormats,
  selectedFrameId,
  textOverlay,
  background,
  padding,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentFormatIndex, setCurrentFormatIndex] = useState(0);
  const [rendering, setRendering] = useState(false);

  const activeFormats = storeFormats.filter((f) => selectedFormats.includes(f.id));
  const currentFormat = activeFormats[currentFormatIndex] || null;
  const currentImage = images[currentImageIndex] || null;
  const frame = deviceFrames.find((f) => f.id === selectedFrameId) || null;

  useEffect(() => {
    if (!currentImage || !currentFormat || !canvasRef.current) return;

    let cancelled = false;
    setRendering(true);

    (async () => {
      try {
        const img = await loadImage(currentImage.url);
        if (cancelled) return;

        const resultCanvas = await renderScreenshot(
          img,
          currentFormat,
          frame,
          textOverlay.text.trim() ? textOverlay : null,
          background,
          padding
        );

        if (cancelled || !canvasRef.current) return;

        const displayCanvas = canvasRef.current;
        const container = displayCanvas.parentElement!;
        const maxW = container.clientWidth - 20;
        const maxH = container.clientHeight - 20;

        const scale = Math.min(maxW / resultCanvas.width, maxH / resultCanvas.height, 1);
        displayCanvas.width = resultCanvas.width * scale;
        displayCanvas.height = resultCanvas.height * scale;

        const ctx = displayCanvas.getContext('2d')!;
        ctx.drawImage(resultCanvas, 0, 0, displayCanvas.width, displayCanvas.height);
      } catch (err) {
        console.error('Render error:', err);
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentImage, currentFormat, frame, textOverlay, background, padding]);

  // Reset indices when data changes
  useEffect(() => {
    if (currentImageIndex >= images.length) setCurrentImageIndex(0);
  }, [images.length, currentImageIndex]);

  useEffect(() => {
    if (currentFormatIndex >= activeFormats.length) setCurrentFormatIndex(0);
  }, [activeFormats.length, currentFormatIndex]);

  if (!images.length) {
    return (
      <div className="preview-empty">
        <Maximize2 size={48} />
        <p>Screenshots hochladen, um die Vorschau zu sehen</p>
      </div>
    );
  }

  if (!activeFormats.length) {
    return (
      <div className="preview-empty">
        <p>Mindestens ein Zielformat auswählen</p>
      </div>
    );
  }

  return (
    <div className="preview">
      <div className="preview-header">
        <div className="preview-nav">
          <span className="preview-label">Bild:</span>
          <button
            className="btn-icon"
            onClick={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
            disabled={currentImageIndex === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            {currentImageIndex + 1} / {images.length}
          </span>
          <button
            className="btn-icon"
            onClick={() =>
              setCurrentImageIndex((i) => Math.min(images.length - 1, i + 1))
            }
            disabled={currentImageIndex >= images.length - 1}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="preview-nav">
          <span className="preview-label">Format:</span>
          <button
            className="btn-icon"
            onClick={() => setCurrentFormatIndex((i) => Math.max(0, i - 1))}
            disabled={currentFormatIndex === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            {currentFormatIndex + 1} / {activeFormats.length}
          </span>
          <button
            className="btn-icon"
            onClick={() =>
              setCurrentFormatIndex((i) => Math.min(activeFormats.length - 1, i + 1))
            }
            disabled={currentFormatIndex >= activeFormats.length - 1}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {currentFormat && (
        <div className="preview-format-info">
          <strong>{currentFormat.device}</strong>
          <span>
            {currentFormat.width} x {currentFormat.height} — {currentFormat.store === 'apple' ? 'App Store' : 'Play Store'}
          </span>
        </div>
      )}

      <div className="preview-canvas-container">
        {rendering && <div className="preview-loading">Rendering...</div>}
        <canvas ref={canvasRef} className="preview-canvas" />
      </div>
    </div>
  );
}
