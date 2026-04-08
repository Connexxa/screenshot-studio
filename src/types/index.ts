export interface StoreFormat {
  id: string;
  store: 'apple' | 'google';
  category: string;
  device: string;
  width: number;
  height: number;
  required: boolean;
  description: string;
}

export interface DeviceFrame {
  id: string;
  name: string;
  platform: 'ios' | 'android';
  type: 'phone' | 'tablet';
  // Bezels in percent of total frame size
  topBezel: number;
  bottomBezel: number;
  sideBezel: number;
  borderRadius: number;
  color: string;
  notchType?: 'dynamic-island' | 'notch' | 'punch-hole' | 'none';
}

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
  name: string;
}

export interface TextOverlay {
  text: string;
  position: 'top' | 'bottom' | 'center';
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  bold: boolean;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image';
  color1: string;
  color2: string;
  gradientDirection: string;
  imageUrl?: string;
}

export interface ProjectConfig {
  selectedFormats: string[];
  selectedFrame: string | null;
  textOverlay: TextOverlay;
  background: BackgroundConfig;
  padding: number;
}

export interface ExportItem {
  format: StoreFormat;
  blob: Blob;
  filename: string;
}

export interface AnimationConfig {
  type: 'gif' | 'video';
  transition: 'slide-left' | 'slide-right' | 'slide-up' | 'fade' | 'none';
  frameDuration: number; // ms per frame
  transitionDuration: number; // ms for transition
  loop: boolean;
}
