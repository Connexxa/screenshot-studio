import type { StoreFormat } from '../types';

export const storeFormats: StoreFormat[] = [
  // ===== APPLE APP STORE =====
  // iPhone
  {
    id: 'apple-iphone-6.9',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 16 Pro Max / 15 Pro Max',
    width: 1320,
    height: 2868,
    required: true,
    description: '6.9" Display (Pflicht)',
  },
  {
    id: 'apple-iphone-6.7',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 16 Plus / 15 Plus',
    width: 1290,
    height: 2796,
    required: false,
    description: '6.7" Display',
  },
  {
    id: 'apple-iphone-6.5',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 14 Plus / 13 Pro Max / 11 Pro Max',
    width: 1284,
    height: 2778,
    required: false,
    description: '6.5" Display (Fallback)',
  },
  {
    id: 'apple-iphone-6.1',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 16 / 15 / 14 / 13',
    width: 1179,
    height: 2556,
    required: false,
    description: '6.1" Display',
  },
  {
    id: 'apple-iphone-5.5',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 8 Plus / 7 Plus',
    width: 1242,
    height: 2208,
    required: false,
    description: '5.5" Display (Legacy)',
  },
  {
    id: 'apple-iphone-4.7',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone SE (2nd/3rd) / 8 / 7',
    width: 750,
    height: 1334,
    required: false,
    description: '4.7" Display (Legacy)',
  },
  // iPad
  {
    id: 'apple-ipad-13',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Pro 13" / iPad Air 13"',
    width: 2064,
    height: 2752,
    required: true,
    description: '13" Display (Pflicht)',
  },
  {
    id: 'apple-ipad-12.9',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Pro 12.9" (Legacy)',
    width: 2048,
    height: 2732,
    required: false,
    description: '12.9" Display',
  },
  {
    id: 'apple-ipad-11',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Pro 11" / iPad Air 11" / iPad 10th',
    width: 1488,
    height: 2266,
    required: false,
    description: '11" Display',
  },
  // Apple Watch
  {
    id: 'apple-watch-ultra',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Ultra',
    width: 410,
    height: 502,
    required: false,
    description: 'Ultra Display',
  },
  {
    id: 'apple-watch-series',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Series 10/11',
    width: 416,
    height: 496,
    required: false,
    description: 'Series 10/11 Display',
  },

  // ===== GOOGLE PLAY STORE =====
  // Phone
  {
    id: 'google-phone',
    store: 'google',
    category: 'Phone',
    device: 'Android Phone',
    width: 1080,
    height: 1920,
    required: true,
    description: 'Phone Screenshots (Pflicht, min. 2)',
  },
  {
    id: 'google-phone-hd',
    store: 'google',
    category: 'Phone',
    device: 'Android Phone (QHD)',
    width: 1440,
    height: 2560,
    required: false,
    description: 'Phone Screenshots (QHD)',
  },
  // Tablets
  {
    id: 'google-tablet-7',
    store: 'google',
    category: 'Tablet',
    device: '7" Tablet',
    width: 1200,
    height: 1920,
    required: false,
    description: '7-Zoll Tablet',
  },
  {
    id: 'google-tablet-10',
    store: 'google',
    category: 'Tablet',
    device: '10" Tablet',
    width: 1800,
    height: 2560,
    required: false,
    description: '10-Zoll Tablet',
  },
  // Feature Graphic
  {
    id: 'google-feature-graphic',
    store: 'google',
    category: 'Promotional',
    device: 'Feature Graphic',
    width: 1024,
    height: 500,
    required: true,
    description: 'Feature Graphic (Pflicht)',
  },
  // App Icon
  {
    id: 'google-icon',
    store: 'google',
    category: 'Promotional',
    device: 'App Icon (Hi-Res)',
    width: 512,
    height: 512,
    required: true,
    description: 'App Icon 512x512 (Pflicht)',
  },
  // Wear OS
  {
    id: 'google-wear',
    store: 'google',
    category: 'Wearable',
    device: 'Wear OS',
    width: 384,
    height: 384,
    required: false,
    description: 'Wear OS (quadratisch)',
  },
  // Chromebook
  {
    id: 'google-chromebook',
    store: 'google',
    category: 'Chromebook',
    device: 'Chromebook',
    width: 1920,
    height: 1080,
    required: false,
    description: 'Chromebook (Landscape)',
  },
];

export const getFormatsByStore = (store: 'apple' | 'google') =>
  storeFormats.filter((f) => f.store === store);

export const getRequiredFormats = () =>
  storeFormats.filter((f) => f.required);

export const getFormatsByCategory = (store: 'apple' | 'google') => {
  const formats = getFormatsByStore(store);
  const categories: Record<string, StoreFormat[]> = {};
  for (const f of formats) {
    if (!categories[f.category]) categories[f.category] = [];
    categories[f.category].push(f);
  }
  return categories;
};
