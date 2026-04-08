import type { StoreFormat } from '../types';

export const storeFormats: StoreFormat[] = [
  // =============================================
  // APPLE APP STORE
  // =============================================

  // ----- iPhone 6.9" Display (Pflicht) -----
  // iPhone 17 Pro Max, 16 Pro Max, 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max
  {
    id: 'apple-iphone-6.9-1320',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 16 Pro Max / 17 Pro Max',
    width: 1320,
    height: 2868,
    required: true,
    description: '6.9" Display (Pflicht)',
  },
  {
    id: 'apple-iphone-6.9-1290',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 16 Plus / 15 Plus',
    width: 1290,
    height: 2796,
    required: false,
    description: '6.9" Display (alt.)',
  },
  {
    id: 'apple-iphone-6.9-1260',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 15 Pro Max / 14 Pro Max',
    width: 1260,
    height: 2736,
    required: false,
    description: '6.9" Display (alt.)',
  },

  // ----- iPhone 6.5" Display -----
  // iPhone 14 Plus, 13 Pro Max, 12 Pro Max, 11 Pro Max, 11, XS Max, XR
  {
    id: 'apple-iphone-6.5-1284',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 14 Plus / 13 Pro Max / 12 Pro Max',
    width: 1284,
    height: 2778,
    required: false,
    description: '6.5" Display',
  },
  {
    id: 'apple-iphone-6.5-1242',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 11 Pro Max / XS Max / XR',
    width: 1242,
    height: 2688,
    required: false,
    description: '6.5" Display (alt.)',
  },

  // ----- iPhone 6.3" Display -----
  // iPhone 17 Pro, 17, 16 Pro, 16, 15 Pro, 15, 14 Pro
  {
    id: 'apple-iphone-6.3-1206',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 17 Pro / 17 / 16 Pro',
    width: 1206,
    height: 2622,
    required: false,
    description: '6.3" Display',
  },
  {
    id: 'apple-iphone-6.3-1179',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 16 / 15 Pro / 15 / 14 Pro',
    width: 1179,
    height: 2556,
    required: false,
    description: '6.3" Display (alt.)',
  },

  // ----- iPhone 6.1" Display -----
  // iPhone 17e, 16e, 14, 13 Pro, 13, 13 mini, 12 Pro, 12, 12 mini, 11 Pro, XS, X
  {
    id: 'apple-iphone-6.1-1170',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 14 / 13 / 12',
    width: 1170,
    height: 2532,
    required: false,
    description: '6.1" Display',
  },
  {
    id: 'apple-iphone-6.1-1125',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 11 Pro / XS / X',
    width: 1125,
    height: 2436,
    required: false,
    description: '6.1" Display (alt.)',
  },
  {
    id: 'apple-iphone-6.1-1080',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 17e / 16e',
    width: 1080,
    height: 2340,
    required: false,
    description: '6.1" Display (alt.)',
  },

  // ----- iPhone 5.5" Display (Legacy) -----
  {
    id: 'apple-iphone-5.5',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone 8 Plus / 7 Plus / 6S Plus',
    width: 1242,
    height: 2208,
    required: false,
    description: '5.5" Display (Legacy)',
  },

  // ----- iPhone 4.7" Display (Legacy) -----
  {
    id: 'apple-iphone-4.7',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone SE (3rd/2nd) / 8 / 7',
    width: 750,
    height: 1334,
    required: false,
    description: '4.7" Display (Legacy)',
  },

  // ----- iPhone 4" Display (Legacy) -----
  {
    id: 'apple-iphone-4.0',
    store: 'apple',
    category: 'iPhone',
    device: 'iPhone SE (1st) / 5S / 5C',
    width: 640,
    height: 1136,
    required: false,
    description: '4" Display (Legacy)',
  },

  // =============================================
  // iPad
  // =============================================

  // ----- iPad 13" Display (Pflicht) -----
  // iPad Pro M5/M4, iPad Pro 6th-1st gen, iPad Air M4/M3/M2
  {
    id: 'apple-ipad-13-2064',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Pro 13" M5/M4',
    width: 2064,
    height: 2752,
    required: true,
    description: '13" Display (Pflicht)',
  },
  {
    id: 'apple-ipad-13-2048',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Pro 12.9" (1st-6th gen)',
    width: 2048,
    height: 2732,
    required: false,
    description: '12.9"/13" Display (alt.)',
  },

  // ----- iPad 11" Display -----
  // iPad Pro M5/M4/4th-1st, iPad Air M4/M3/M2/5th/4th, iPad A16/10th, iPad mini A17/6th
  {
    id: 'apple-ipad-11-1488',
    store: 'apple',
    category: 'iPad',
    device: 'iPad mini A17 Pro / 6th gen',
    width: 1488,
    height: 2266,
    required: false,
    description: '11" Display (iPad mini)',
  },
  {
    id: 'apple-ipad-11-1668-2420',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Air M2/5th/4th / iPad A16/10th',
    width: 1668,
    height: 2420,
    required: false,
    description: '11" Display (iPad Air)',
  },
  {
    id: 'apple-ipad-11-1668-2388',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Pro 11" (1st-4th gen)',
    width: 1668,
    height: 2388,
    required: false,
    description: '11" Display (iPad Pro)',
  },
  {
    id: 'apple-ipad-11-1640',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Pro 11" M4 / iPad Air M3',
    width: 1640,
    height: 2360,
    required: false,
    description: '11" Display (M4/M3)',
  },

  // ----- iPad 10.5" Display -----
  {
    id: 'apple-ipad-10.5',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Air 3rd / iPad 9th-7th gen',
    width: 1668,
    height: 2224,
    required: false,
    description: '10.5" Display (Legacy)',
  },

  // ----- iPad 9.7" Display -----
  {
    id: 'apple-ipad-9.7',
    store: 'apple',
    category: 'iPad',
    device: 'iPad Air 1/2 / iPad 3rd-6th / mini 2-5',
    width: 1536,
    height: 2048,
    required: false,
    description: '9.7" Display (Legacy)',
  },

  // =============================================
  // Apple Watch
  // =============================================
  {
    id: 'apple-watch-ultra3',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Ultra 3',
    width: 422,
    height: 514,
    required: false,
    description: 'Ultra 3',
  },
  {
    id: 'apple-watch-ultra',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Ultra 2 / Ultra',
    width: 410,
    height: 502,
    required: false,
    description: 'Ultra 2 / Ultra',
  },
  {
    id: 'apple-watch-series11',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Series 11 / 10',
    width: 416,
    height: 496,
    required: false,
    description: 'Series 11 / 10',
  },
  {
    id: 'apple-watch-series9',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Series 9 / 8 / 7',
    width: 396,
    height: 484,
    required: false,
    description: 'Series 9 / 8 / 7',
  },
  {
    id: 'apple-watch-series6',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Series 6 / 5 / 4 / SE',
    width: 368,
    height: 448,
    required: false,
    description: 'Series 6 / 5 / 4 / SE',
  },
  {
    id: 'apple-watch-series3',
    store: 'apple',
    category: 'Apple Watch',
    device: 'Apple Watch Series 3',
    width: 312,
    height: 390,
    required: false,
    description: 'Series 3 (Legacy)',
  },

  // =============================================
  // GOOGLE PLAY STORE
  // =============================================

  // ----- Phone -----
  {
    id: 'google-phone-1080-1920',
    store: 'google',
    category: 'Phone',
    device: 'Android Phone (FHD 16:9)',
    width: 1080,
    height: 1920,
    required: true,
    description: 'Phone FHD (Pflicht, min. 2)',
  },
  {
    id: 'google-phone-1080-2340',
    store: 'google',
    category: 'Phone',
    device: 'Android Phone (FHD+ 19.5:9)',
    width: 1080,
    height: 2340,
    required: false,
    description: 'Phone FHD+ (moderne Geräte)',
  },
  {
    id: 'google-phone-1080-2400',
    store: 'google',
    category: 'Phone',
    device: 'Android Phone (FHD+ 20:9)',
    width: 1080,
    height: 2400,
    required: false,
    description: 'Phone FHD+ (Pixel, Samsung)',
  },
  {
    id: 'google-phone-1440-3120',
    store: 'google',
    category: 'Phone',
    device: 'Android Phone (QHD+)',
    width: 1440,
    height: 3120,
    required: false,
    description: 'Phone QHD+ (Flagship)',
  },

  // ----- Tablets -----
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

  // ----- Promotional -----
  {
    id: 'google-feature-graphic',
    store: 'google',
    category: 'Promotional',
    device: 'Vorstellungsgrafik',
    width: 1024,
    height: 500,
    required: true,
    description: 'Vorstellungsgrafik (Pflicht, PNG/JPEG, max. 15 MB)',
  },
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

  // ----- Wearable -----
  {
    id: 'google-wear',
    store: 'google',
    category: 'Wearable',
    device: 'Wear OS',
    width: 384,
    height: 384,
    required: false,
    description: 'Wear OS (quadratisch, ohne Rahmen)',
  },

  // ----- TV -----
  {
    id: 'google-tv',
    store: 'google',
    category: 'TV',
    device: 'Android TV',
    width: 1920,
    height: 1080,
    required: false,
    description: 'Android TV (16:9 Landscape)',
  },

  // ----- Chromebook -----
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
