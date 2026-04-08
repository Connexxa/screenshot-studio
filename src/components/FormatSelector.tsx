import { Monitor, Smartphone, Tablet, Watch } from 'lucide-react';
import type { StoreFormat } from '../types';
import { getFormatsByCategory, storeFormats } from '../data/storeFormats';

interface Props {
  selectedFormats: string[];
  onSelectedFormatsChange: (ids: string[]) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  iPhone: <Smartphone size={14} />,
  iPad: <Tablet size={14} />,
  'Apple Watch': <Watch size={14} />,
  Phone: <Smartphone size={14} />,
  Tablet: <Tablet size={14} />,
  Promotional: <Monitor size={14} />,
  Wearable: <Watch size={14} />,
  Chromebook: <Monitor size={14} />,
};

export function FormatSelector({ selectedFormats, onSelectedFormatsChange }: Props) {
  const toggleFormat = (id: string) => {
    if (selectedFormats.includes(id)) {
      onSelectedFormatsChange(selectedFormats.filter((f) => f !== id));
    } else {
      onSelectedFormatsChange([...selectedFormats, id]);
    }
  };

  const selectAllRequired = () => {
    const requiredIds = storeFormats
      .filter((f) => f.required)
      .map((f) => f.id);
    const merged = new Set([...selectedFormats, ...requiredIds]);
    onSelectedFormatsChange([...merged]);
  };

  const renderStore = (store: 'apple' | 'google', title: string) => {
    const categories = getFormatsByCategory(store);
    return (
      <div className="store-section">
        <h4 className="store-title">{title}</h4>
        {Object.entries(categories).map(([category, formats]) => (
          <div key={category} className="format-category">
            <div className="category-header">
              {categoryIcons[category]} {category}
            </div>
            {formats.map((format) => (
              <label key={format.id} className="format-item">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes(format.id)}
                  onChange={() => toggleFormat(format.id)}
                />
                <div className="format-details">
                  <span className="format-device">{format.device}</span>
                  <span className="format-dims">
                    {format.width} x {format.height}
                    {format.required && <span className="badge-required">Pflicht</span>}
                  </span>
                </div>
              </label>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="format-selector">
      <div className="format-header">
        <h3>Zielformate</h3>
        <button className="btn-small" onClick={selectAllRequired}>
          Alle Pflicht-Formate
        </button>
      </div>
      {renderStore('apple', 'Apple App Store')}
      {renderStore('google', 'Google Play Store')}
      <div className="selected-count">
        {selectedFormats.length} Format(e) ausgewählt
      </div>
    </div>
  );
}
