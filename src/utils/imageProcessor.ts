import type { StoreFormat, DeviceFrame, TextOverlay, BackgroundConfig } from '../types';

/**
 * Renders a screenshot with device frame, text overlay, and background
 * onto a canvas at the target store format dimensions.
 */
export async function renderScreenshot(
  sourceImage: HTMLImageElement,
  format: StoreFormat,
  frame: DeviceFrame | null,
  textOverlay: TextOverlay | null,
  background: BackgroundConfig,
  padding: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = format.width;
  canvas.height = format.height;
  const ctx = canvas.getContext('2d')!;

  // 1. Draw background
  drawBackground(ctx, canvas.width, canvas.height, background);

  // 2. Calculate device frame area
  const paddingPx = Math.round(Math.min(canvas.width, canvas.height) * (padding / 100));

  // Reserve space for text overlay
  let textAreaTop = 0;
  let textAreaBottom = 0;
  if (textOverlay && textOverlay.text.trim()) {
    const textHeight = Math.round(canvas.height * 0.12);
    if (textOverlay.position === 'top') {
      textAreaTop = textHeight;
    } else if (textOverlay.position === 'bottom') {
      textAreaBottom = textHeight;
    }
  }

  const availableX = paddingPx;
  const availableY = paddingPx + textAreaTop;
  const availableW = canvas.width - paddingPx * 2;
  const availableH = canvas.height - paddingPx * 2 - textAreaTop - textAreaBottom;

  if (frame && frame.id !== 'none') {
    // 3a. Draw with device frame
    drawDeviceFrame(ctx, sourceImage, frame, availableX, availableY, availableW, availableH);
  } else {
    // 3b. Draw image directly (fit to available area)
    const fit = fitImage(sourceImage.width, sourceImage.height, availableW, availableH);
    const imgX = availableX + (availableW - fit.width) / 2;
    const imgY = availableY + (availableH - fit.height) / 2;
    ctx.drawImage(sourceImage, imgX, imgY, fit.width, fit.height);
  }

  // 4. Draw text overlay
  if (textOverlay && textOverlay.text.trim()) {
    drawTextOverlay(ctx, canvas.width, canvas.height, textOverlay, textAreaTop, textAreaBottom, paddingPx);
  }

  return canvas;
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bg: BackgroundConfig
) {
  if (bg.type === 'solid') {
    ctx.fillStyle = bg.color1;
    ctx.fillRect(0, 0, w, h);
  } else if (bg.type === 'gradient') {
    let gradient: CanvasGradient;
    switch (bg.gradientDirection) {
      case 'horizontal':
        gradient = ctx.createLinearGradient(0, 0, w, 0);
        break;
      case 'diagonal':
        gradient = ctx.createLinearGradient(0, 0, w, h);
        break;
      case 'radial':
        gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
        break;
      default: // vertical
        gradient = ctx.createLinearGradient(0, 0, 0, h);
    }
    gradient.addColorStop(0, bg.color1);
    gradient.addColorStop(1, bg.color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawDeviceFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  frame: DeviceFrame,
  x: number,
  y: number,
  maxW: number,
  maxH: number
) {
  // Calculate frame dimensions
  const topBezelPct = frame.topBezel / 100;
  const bottomBezelPct = frame.bottomBezel / 100;
  const sideBezelPct = frame.sideBezel / 100;

  // The screen area ratio inside the frame
  const screenRatioW = 1 - 2 * sideBezelPct;
  const screenRatioH = 1 - topBezelPct - bottomBezelPct;

  // Determine frame size to fit within available area
  // We want the screen area to show the image at the best fit
  const imgAspect = img.width / img.height;

  // Frame aspect = screenW / screenH * adjustments
  // Let's figure out the frame size so the screen area fits the image
  let frameW: number, frameH: number;

  // Try fitting by height first
  frameH = maxH;
  const screenH = frameH * screenRatioH;
  const screenW = screenH * imgAspect;
  frameW = screenW / screenRatioW;

  if (frameW > maxW) {
    // Fit by width instead
    frameW = maxW;
    const sw = frameW * screenRatioW;
    const sh = sw / imgAspect;
    frameH = sh / screenRatioH;
  }

  const frameX = x + (maxW - frameW) / 2;
  const frameY = y + (maxH - frameH) / 2;

  // Draw outer frame
  const outerRadius = frame.borderRadius * (frameW / 1000);
  ctx.save();

  // Frame shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = frameW * 0.02;
  ctx.shadowOffsetY = frameW * 0.01;

  roundRect(ctx, frameX, frameY, frameW, frameH, outerRadius);
  ctx.fillStyle = frame.color;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Frame border (subtle highlight)
  ctx.strokeStyle = frame.color === '#1a1a1a'
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Screen area
  const scrX = frameX + frameW * sideBezelPct;
  const scrY = frameY + frameH * topBezelPct;
  const scrW = frameW * screenRatioW;
  const scrH = frameH * screenRatioH;

  const innerRadius = outerRadius * 0.7;
  ctx.save();
  roundRect(ctx, scrX, scrY, scrW, scrH, innerRadius);
  ctx.clip();

  // Draw image to fill screen area
  const fit = coverImage(img.width, img.height, scrW, scrH);
  ctx.drawImage(
    img,
    scrX + (scrW - fit.width) / 2,
    scrY + (scrH - fit.height) / 2,
    fit.width,
    fit.height
  );
  ctx.restore();

  // Draw notch/dynamic island
  if (frame.notchType === 'dynamic-island') {
    const diW = frameW * 0.2;
    const diH = frameH * 0.012;
    const diX = frameX + (frameW - diW) / 2;
    const diY = frameY + frameH * topBezelPct * 0.35;
    const diRadius = diH / 2;

    ctx.fillStyle = '#000';
    roundRect(ctx, diX, diY, diW, diH, diRadius);
    ctx.fill();
  } else if (frame.notchType === 'punch-hole') {
    const holeR = frameW * 0.012;
    const holeX = frameX + frameW / 2;
    const holeY = frameY + frameH * topBezelPct * 0.5;
    ctx.beginPath();
    ctx.arc(holeX, holeY, holeR, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
  }

  ctx.restore();
}

function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  canvasW: number,
  canvasH: number,
  overlay: TextOverlay,
  textAreaTop: number,
  textAreaBottom: number,
  padding: number
) {
  const fontSize = Math.round(canvasH * (overlay.fontSize / 1000));
  const fontWeight = overlay.bold ? 'bold' : 'normal';
  ctx.font = `${fontWeight} ${fontSize}px ${overlay.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = overlay.color;

  const maxWidth = canvasW - padding * 2;
  const lines = wrapText(ctx, overlay.text, maxWidth);
  const lineHeight = fontSize * 1.3;

  let startY: number;
  if (overlay.position === 'top') {
    startY = padding + (textAreaTop - lines.length * lineHeight) / 2 + fontSize;
  } else if (overlay.position === 'bottom') {
    startY = canvasH - textAreaBottom + (textAreaBottom - lines.length * lineHeight) / 2 + fontSize - padding;
  } else {
    startY = (canvasH - lines.length * lineHeight) / 2 + fontSize;
  }

  // Draw background behind text if set
  if (overlay.backgroundColor && overlay.backgroundColor !== 'transparent') {
    const totalTextH = lines.length * lineHeight + fontSize * 0.5;
    ctx.fillStyle = overlay.backgroundColor;
    ctx.fillRect(
      padding,
      startY - fontSize - fontSize * 0.1,
      canvasW - padding * 2,
      totalTextH
    );
    ctx.fillStyle = overlay.color;
  }

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], canvasW / 2, startY + i * lineHeight);
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function fitImage(imgW: number, imgH: number, maxW: number, maxH: number) {
  const scale = Math.min(maxW / imgW, maxH / imgH);
  return { width: imgW * scale, height: imgH * scale };
}

function coverImage(imgW: number, imgH: number, targetW: number, targetH: number) {
  const scale = Math.max(targetW / imgW, targetH / imgH);
  return { width: imgW * scale, height: imgH * scale };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Load an image from URL and return HTMLImageElement
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Export canvas to Blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, format: 'png' | 'jpeg' = 'png', quality = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      `image/${format}`,
      quality
    );
  });
}
