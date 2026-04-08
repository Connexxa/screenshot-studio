import type { AnimationConfig } from '../types';

/**
 * Creates an animated GIF from an array of canvas frames.
 * Uses a simple GIF encoder implementation since gif.js has worker issues in Vite.
 */
export async function createAnimatedGif(
  frames: HTMLCanvasElement[],
  config: AnimationConfig,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Use a manual GIF encoding approach
  const width = frames[0].width;
  const height = frames[0].height;

  // Scale down for GIF to keep file size reasonable
  const maxDim = 600;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const gifW = Math.round(width * scale);
  const gifH = Math.round(height * scale);

  const scaledFrames: ImageData[] = [];

  for (let i = 0; i < frames.length; i++) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gifW;
    tempCanvas.height = gifH;
    const ctx = tempCanvas.getContext('2d')!;
    ctx.drawImage(frames[i], 0, 0, gifW, gifH);
    scaledFrames.push(ctx.getImageData(0, 0, gifW, gifH));
    onProgress?.(((i + 1) / frames.length) * 0.5);
  }

  // Build GIF binary
  const delay = Math.round(config.frameDuration / 10); // GIF delay is in centiseconds
  const gifBytes = encodeGif(scaledFrames, gifW, gifH, delay, config.loop);

  onProgress?.(1);
  return new Blob([gifBytes], { type: 'image/gif' });
}

/**
 * Generate transition frames between two canvases
 */
export function generateTransitionFrames(
  from: HTMLCanvasElement,
  to: HTMLCanvasElement,
  transition: AnimationConfig['transition'],
  steps: number
): HTMLCanvasElement[] {
  const w = from.width;
  const h = from.height;
  const frames: HTMLCanvasElement[] = [];

  for (let i = 0; i < steps; i++) {
    const progress = i / steps;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    switch (transition) {
      case 'fade':
        ctx.drawImage(from, 0, 0);
        ctx.globalAlpha = progress;
        ctx.drawImage(to, 0, 0);
        ctx.globalAlpha = 1;
        break;

      case 'slide-left':
        ctx.drawImage(from, -w * progress, 0);
        ctx.drawImage(to, w * (1 - progress), 0);
        break;

      case 'slide-right':
        ctx.drawImage(from, w * progress, 0);
        ctx.drawImage(to, -w * (1 - progress), 0);
        break;

      case 'slide-up':
        ctx.drawImage(from, 0, -h * progress);
        ctx.drawImage(to, 0, h * (1 - progress));
        break;

      case 'none':
      default:
        ctx.drawImage(to, 0, 0);
        break;
    }

    frames.push(canvas);
  }

  return frames;
}

// Minimal GIF89a encoder
function encodeGif(frames: ImageData[], width: number, height: number, delay: number, loop: boolean): Uint8Array {
  const buf: number[] = [];

  // Header
  writeStr(buf, 'GIF89a');

  // Logical Screen Descriptor
  writeU16(buf, width);
  writeU16(buf, height);
  buf.push(0x70); // no GCT, 8 bit color depth
  buf.push(0);    // bg color index
  buf.push(0);    // pixel aspect ratio

  // Netscape extension for looping
  if (loop) {
    buf.push(0x21, 0xFF, 0x0B);
    writeStr(buf, 'NETSCAPE2.0');
    buf.push(0x03, 0x01);
    writeU16(buf, 0); // loop count 0 = infinite
    buf.push(0x00);
  }

  for (const frame of frames) {
    // Build color table from frame (quantize to 256 colors)
    const { indices, colorTable } = quantizeFrame(frame);

    // Graphic Control Extension
    buf.push(0x21, 0xF9, 0x04);
    buf.push(0x00); // no transparency
    writeU16(buf, delay);
    buf.push(0x00); // transparent color index
    buf.push(0x00); // terminator

    // Image Descriptor
    buf.push(0x2C);
    writeU16(buf, 0); // left
    writeU16(buf, 0); // top
    writeU16(buf, width);
    writeU16(buf, height);
    buf.push(0x87); // local color table, 256 colors (2^(7+1)=256)

    // Local Color Table (256 * 3 bytes)
    for (let i = 0; i < 256; i++) {
      buf.push(colorTable[i * 3] || 0);
      buf.push(colorTable[i * 3 + 1] || 0);
      buf.push(colorTable[i * 3 + 2] || 0);
    }

    // LZW compressed image data
    const minCodeSize = 8;
    buf.push(minCodeSize);
    const compressed = lzwEncode(indices, minCodeSize);

    // Write sub-blocks
    let offset = 0;
    while (offset < compressed.length) {
      const chunkSize = Math.min(255, compressed.length - offset);
      buf.push(chunkSize);
      for (let i = 0; i < chunkSize; i++) {
        buf.push(compressed[offset + i]);
      }
      offset += chunkSize;
    }
    buf.push(0x00); // block terminator
  }

  // Trailer
  buf.push(0x3B);

  return new Uint8Array(buf);
}

function quantizeFrame(imageData: ImageData): { indices: Uint8Array; colorTable: Uint8Array } {
  const pixels = imageData.data;
  const numPixels = imageData.width * imageData.height;
  const colorTable = new Uint8Array(256 * 3);
  const indices = new Uint8Array(numPixels);

  // Simple median-cut-like quantization: build a color map
  const colorMap = new Map<number, number>();
  const colors: [number, number, number][] = [];

  for (let i = 0; i < numPixels; i++) {
    const r = pixels[i * 4] >> 2;     // 6-bit
    const g = pixels[i * 4 + 1] >> 2;
    const b = pixels[i * 4 + 2] >> 2;
    const key = (r << 12) | (g << 6) | b;

    if (!colorMap.has(key) && colors.length < 256) {
      colorMap.set(key, colors.length);
      colors.push([pixels[i * 4], pixels[i * 4 + 1], pixels[i * 4 + 2]]);
    }
  }

  // Fill color table
  for (let i = 0; i < colors.length; i++) {
    colorTable[i * 3] = colors[i][0];
    colorTable[i * 3 + 1] = colors[i][1];
    colorTable[i * 3 + 2] = colors[i][2];
  }

  // Map pixels to nearest color
  for (let i = 0; i < numPixels; i++) {
    const r = pixels[i * 4] >> 2;
    const g = pixels[i * 4 + 1] >> 2;
    const b = pixels[i * 4 + 2] >> 2;
    const key = (r << 12) | (g << 6) | b;

    if (colorMap.has(key)) {
      indices[i] = colorMap.get(key)!;
    } else {
      // Find nearest color
      let minDist = Infinity;
      let bestIdx = 0;
      const pr = pixels[i * 4], pg = pixels[i * 4 + 1], pb = pixels[i * 4 + 2];
      for (let c = 0; c < colors.length; c++) {
        const dr = pr - colors[c][0];
        const dg = pg - colors[c][1];
        const db = pb - colors[c][2];
        const dist = dr * dr + dg * dg + db * db;
        if (dist < minDist) {
          minDist = dist;
          bestIdx = c;
        }
      }
      indices[i] = bestIdx;
    }
  }

  return { indices, colorTable };
}

function lzwEncode(indices: Uint8Array, minCodeSize: number): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;
  const output: number[] = [];

  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;
  const maxCode = 4096;

  // Bit packing
  let curByte = 0;
  let curBit = 0;

  function writeBits(code: number, size: number) {
    curByte |= (code << curBit);
    curBit += size;
    while (curBit >= 8) {
      output.push(curByte & 0xFF);
      curByte >>= 8;
      curBit -= 8;
    }
  }

  // Initialize code table
  let codeTable = new Map<string, number>();
  function resetTable() {
    codeTable = new Map();
    for (let i = 0; i < clearCode; i++) {
      codeTable.set(String(i), i);
    }
    nextCode = eoiCode + 1;
    codeSize = minCodeSize + 1;
  }

  resetTable();
  writeBits(clearCode, codeSize);

  if (indices.length === 0) {
    writeBits(eoiCode, codeSize);
    if (curBit > 0) output.push(curByte & 0xFF);
    return new Uint8Array(output);
  }

  let indexBuffer = String(indices[0]);

  for (let i = 1; i < indices.length; i++) {
    const k = String(indices[i]);
    const combined = indexBuffer + ',' + k;

    if (codeTable.has(combined)) {
      indexBuffer = combined;
    } else {
      writeBits(codeTable.get(indexBuffer)!, codeSize);

      if (nextCode < maxCode) {
        codeTable.set(combined, nextCode);
        nextCode++;
        if (nextCode > (1 << codeSize) && codeSize < 12) {
          codeSize++;
        }
      } else {
        writeBits(clearCode, codeSize);
        resetTable();
      }

      indexBuffer = k;
    }
  }

  writeBits(codeTable.get(indexBuffer)!, codeSize);
  writeBits(eoiCode, codeSize);

  if (curBit > 0) {
    output.push(curByte & 0xFF);
  }

  return new Uint8Array(output);
}

function writeStr(buf: number[], str: string) {
  for (let i = 0; i < str.length; i++) {
    buf.push(str.charCodeAt(i));
  }
}

function writeU16(buf: number[], val: number) {
  buf.push(val & 0xFF);
  buf.push((val >> 8) & 0xFF);
}
