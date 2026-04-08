import { useState } from 'react';
import { Download, Film, Loader2, Settings } from 'lucide-react';
import type { UploadedImage, TextOverlay, BackgroundConfig, AnimationConfig } from '../types';
import { storeFormats } from '../data/storeFormats';
import { deviceFrames } from '../data/deviceFrames';
import { exportAll, downloadAsZip } from '../utils/exportUtils';
import { renderScreenshot, loadImage, canvasToBlob } from '../utils/imageProcessor';
import { createAnimatedGif, generateTransitionFrames } from '../utils/gifEncoder';
import { saveAs } from 'file-saver';

interface Props {
  images: UploadedImage[];
  selectedFormats: string[];
  selectedFrameId: string | null;
  textOverlay: TextOverlay;
  background: BackgroundConfig;
  padding: number;
}

export function ExportPanel({
  images,
  selectedFormats,
  selectedFrameId,
  textOverlay,
  background,
  padding,
}: Props) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animConfig, setAnimConfig] = useState<AnimationConfig>({
    type: 'gif',
    transition: 'slide-left',
    frameDuration: 2000,
    transitionDuration: 500,
    loop: true,
  });

  const activeFormats = storeFormats.filter((f) => selectedFormats.includes(f.id));
  const frame = deviceFrames.find((f) => f.id === selectedFrameId) || null;
  const canExport = images.length > 0 && activeFormats.length > 0;

  const handleExportAll = async () => {
    if (!canExport) return;
    setExporting(true);
    setProgress(0);

    try {
      const results = await exportAll(
        images,
        activeFormats,
        frame,
        textOverlay,
        background,
        padding,
        (current, total) => setProgress(Math.round((current / total) * 100))
      );

      await downloadAsZip(results, 'connexxa-screenshots');
    } catch (err) {
      console.error('Export error:', err);
      alert('Export fehlgeschlagen: ' + (err as Error).message);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  const handleExportGif = async () => {
    if (images.length < 2) {
      alert('Mindestens 2 Bilder für eine Animation nötig');
      return;
    }

    const targetFormat = activeFormats[0];
    if (!targetFormat) {
      alert('Bitte mindestens ein Zielformat auswählen');
      return;
    }

    setExporting(true);
    setProgress(0);

    try {
      // Render all screenshots at target format
      const renderedFrames: HTMLCanvasElement[] = [];
      for (let i = 0; i < images.length; i++) {
        const img = await loadImage(images[i].url);
        const canvas = await renderScreenshot(
          img,
          targetFormat,
          frame,
          textOverlay.text.trim() ? textOverlay : null,
          background,
          padding
        );
        renderedFrames.push(canvas);
        setProgress(Math.round(((i + 1) / images.length) * 30));
      }

      // Generate transition frames
      const allFrames: HTMLCanvasElement[] = [];
      const transitionSteps = animConfig.transition === 'none' ? 0 : 8;

      for (let i = 0; i < renderedFrames.length; i++) {
        allFrames.push(renderedFrames[i]);

        if (i < renderedFrames.length - 1 && transitionSteps > 0) {
          const transitions = generateTransitionFrames(
            renderedFrames[i],
            renderedFrames[i + 1],
            animConfig.transition,
            transitionSteps
          );
          allFrames.push(...transitions);
        }
      }

      setProgress(50);

      // Create GIF
      const gifBlob = await createAnimatedGif(allFrames, animConfig, (p) => {
        setProgress(50 + Math.round(p * 50));
      });

      saveAs(gifBlob, `app-preview_${targetFormat.id}.gif`);
    } catch (err) {
      console.error('GIF export error:', err);
      alert('GIF-Export fehlgeschlagen: ' + (err as Error).message);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  const handleExportVideo = async () => {
    if (images.length < 2) {
      alert('Mindestens 2 Bilder für ein Video nötig');
      return;
    }

    const targetFormat = activeFormats[0];
    if (!targetFormat) {
      alert('Bitte mindestens ein Zielformat auswählen');
      return;
    }

    setExporting(true);
    setProgress(0);

    try {
      // Render frames
      const renderedFrames: HTMLCanvasElement[] = [];
      for (let i = 0; i < images.length; i++) {
        const img = await loadImage(images[i].url);
        const canvas = await renderScreenshot(
          img,
          targetFormat,
          frame,
          textOverlay.text.trim() ? textOverlay : null,
          background,
          padding
        );
        renderedFrames.push(canvas);
      }

      // Use MediaRecorder to create WebM video
      const outputCanvas = document.createElement('canvas');
      const maxDim = 1080;
      const scale = Math.min(1, maxDim / Math.max(targetFormat.width, targetFormat.height));
      outputCanvas.width = Math.round(targetFormat.width * scale);
      outputCanvas.height = Math.round(targetFormat.height * scale);
      // Ensure even dimensions for video encoding
      outputCanvas.width = outputCanvas.width % 2 === 0 ? outputCanvas.width : outputCanvas.width + 1;
      outputCanvas.height = outputCanvas.height % 2 === 0 ? outputCanvas.height : outputCanvas.height + 1;
      const ctx = outputCanvas.getContext('2d')!;

      const stream = outputCanvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      const recordingDone = new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => resolve();
      });

      mediaRecorder.start();

      // Draw each frame for the configured duration
      const fps = 30;
      const frameDurationFrames = Math.round((animConfig.frameDuration / 1000) * fps);
      const transitionFrames = animConfig.transition === 'none' ? 0 : Math.round((animConfig.transitionDuration / 1000) * fps);

      for (let i = 0; i < renderedFrames.length; i++) {
        // Hold frame
        for (let f = 0; f < frameDurationFrames; f++) {
          ctx.drawImage(renderedFrames[i], 0, 0, outputCanvas.width, outputCanvas.height);
          await new Promise((r) => setTimeout(r, 1000 / fps));
        }

        // Transition
        if (i < renderedFrames.length - 1 && transitionFrames > 0) {
          for (let t = 0; t < transitionFrames; t++) {
            const progress = t / transitionFrames;
            ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

            switch (animConfig.transition) {
              case 'fade':
                ctx.globalAlpha = 1;
                ctx.drawImage(renderedFrames[i], 0, 0, outputCanvas.width, outputCanvas.height);
                ctx.globalAlpha = progress;
                ctx.drawImage(renderedFrames[i + 1], 0, 0, outputCanvas.width, outputCanvas.height);
                ctx.globalAlpha = 1;
                break;
              case 'slide-left':
                ctx.drawImage(renderedFrames[i], -outputCanvas.width * progress, 0, outputCanvas.width, outputCanvas.height);
                ctx.drawImage(renderedFrames[i + 1], outputCanvas.width * (1 - progress), 0, outputCanvas.width, outputCanvas.height);
                break;
              case 'slide-right':
                ctx.drawImage(renderedFrames[i], outputCanvas.width * progress, 0, outputCanvas.width, outputCanvas.height);
                ctx.drawImage(renderedFrames[i + 1], -outputCanvas.width * (1 - progress), 0, outputCanvas.width, outputCanvas.height);
                break;
              case 'slide-up':
                ctx.drawImage(renderedFrames[i], 0, -outputCanvas.height * progress, outputCanvas.width, outputCanvas.height);
                ctx.drawImage(renderedFrames[i + 1], 0, outputCanvas.height * (1 - progress), outputCanvas.width, outputCanvas.height);
                break;
            }

            await new Promise((r) => setTimeout(r, 1000 / fps));
          }
        }

        setProgress(Math.round(((i + 1) / renderedFrames.length) * 100));
      }

      // Hold last frame briefly
      for (let f = 0; f < fps; f++) {
        ctx.drawImage(renderedFrames[renderedFrames.length - 1], 0, 0, outputCanvas.width, outputCanvas.height);
        await new Promise((r) => setTimeout(r, 1000 / fps));
      }

      mediaRecorder.stop();
      await recordingDone;

      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      saveAs(videoBlob, `app-preview_${targetFormat.id}.webm`);
    } catch (err) {
      console.error('Video export error:', err);
      alert('Video-Export fehlgeschlagen: ' + (err as Error).message);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="export-panel">
      <h3>
        <Download size={18} /> Export
      </h3>

      {/* Screenshot Export */}
      <div className="export-section">
        <div className="export-info">
          <strong>{images.length}</strong> Bild(er) x{' '}
          <strong>{activeFormats.length}</strong> Format(e) ={' '}
          <strong>{images.length * activeFormats.length}</strong> Dateien
        </div>

        <button
          className="btn-primary btn-full"
          onClick={handleExportAll}
          disabled={!canExport || exporting}
        >
          {exporting ? (
            <>
              <Loader2 size={16} className="spinner" /> Exportiere... {progress}%
            </>
          ) : (
            <>
              <Download size={16} /> Alle als ZIP exportieren
            </>
          )}
        </button>
      </div>

      {/* Animation Export */}
      <div className="export-section">
        <h4>
          <Film size={16} /> Animation
        </h4>

        <div className="form-group">
          <label>Übergang</label>
          <select
            value={animConfig.transition}
            onChange={(e) =>
              setAnimConfig({ ...animConfig, transition: e.target.value as AnimationConfig['transition'] })
            }
          >
            <option value="slide-left">Slide Links</option>
            <option value="slide-right">Slide Rechts</option>
            <option value="slide-up">Slide Hoch</option>
            <option value="fade">Überblenden</option>
            <option value="none">Kein Übergang</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Dauer/Bild</label>
            <select
              value={animConfig.frameDuration}
              onChange={(e) =>
                setAnimConfig({ ...animConfig, frameDuration: Number(e.target.value) })
              }
            >
              <option value={1000}>1 Sek.</option>
              <option value={2000}>2 Sek.</option>
              <option value={3000}>3 Sek.</option>
              <option value={5000}>5 Sek.</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={animConfig.loop}
                onChange={(e) =>
                  setAnimConfig({ ...animConfig, loop: e.target.checked })
                }
              />{' '}
              Endlosschleife
            </label>
          </div>
        </div>

        <div className="btn-group">
          <button
            className="btn-secondary"
            onClick={handleExportGif}
            disabled={images.length < 2 || !activeFormats.length || exporting}
          >
            GIF erstellen
          </button>
          <button
            className="btn-secondary"
            onClick={handleExportVideo}
            disabled={images.length < 2 || !activeFormats.length || exporting}
          >
            Video erstellen
          </button>
        </div>
      </div>

      {/* Padding */}
      <div className="export-section">
        <h4>
          <Settings size={16} /> Einstellungen
        </h4>
        <div className="form-group">
          <label>Padding: {padding}%</label>
          <input
            type="range"
            min={0}
            max={15}
            value={padding}
            onChange={() => {}} // handled in parent
            disabled
          />
        </div>
      </div>
    </div>
  );
}
