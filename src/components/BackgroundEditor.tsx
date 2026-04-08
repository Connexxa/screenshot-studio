import { Palette } from 'lucide-react';
import type { BackgroundConfig } from '../types';

interface Props {
  background: BackgroundConfig;
  onChange: (bg: BackgroundConfig) => void;
}

const PRESETS: { name: string; bg: BackgroundConfig }[] = [
  {
    name: 'Weiss',
    bg: { type: 'solid', color1: '#ffffff', color2: '#ffffff', gradientDirection: 'vertical' },
  },
  {
    name: 'Schwarz',
    bg: { type: 'solid', color1: '#000000', color2: '#000000', gradientDirection: 'vertical' },
  },
  {
    name: 'Blau-Gradient',
    bg: { type: 'gradient', color1: '#667eea', color2: '#764ba2', gradientDirection: 'vertical' },
  },
  {
    name: 'Sonnenuntergang',
    bg: { type: 'gradient', color1: '#f093fb', color2: '#f5576c', gradientDirection: 'diagonal' },
  },
  {
    name: 'Ozean',
    bg: { type: 'gradient', color1: '#4facfe', color2: '#00f2fe', gradientDirection: 'vertical' },
  },
  {
    name: 'Wald',
    bg: { type: 'gradient', color1: '#38ef7d', color2: '#11998e', gradientDirection: 'vertical' },
  },
  {
    name: 'Dunkel-Blau',
    bg: { type: 'gradient', color1: '#0f0c29', color2: '#302b63', gradientDirection: 'diagonal' },
  },
  {
    name: 'Warm',
    bg: { type: 'gradient', color1: '#ff9a9e', color2: '#fecfef', gradientDirection: 'vertical' },
  },
];

export function BackgroundEditor({ background, onChange }: Props) {
  const update = (partial: Partial<BackgroundConfig>) => {
    onChange({ ...background, ...partial });
  };

  return (
    <div className="background-editor">
      <h3>
        <Palette size={18} /> Hintergrund
      </h3>

      <div className="preset-grid">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            className="preset-btn"
            title={preset.name}
            onClick={() => onChange(preset.bg)}
            style={{
              background:
                preset.bg.type === 'solid'
                  ? preset.bg.color1
                  : `linear-gradient(${preset.bg.gradientDirection === 'diagonal' ? '135deg' : '180deg'}, ${preset.bg.color1}, ${preset.bg.color2})`,
            }}
          />
        ))}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Typ</label>
          <select
            value={background.type}
            onChange={(e) => update({ type: e.target.value as BackgroundConfig['type'] })}
          >
            <option value="solid">Einfarbig</option>
            <option value="gradient">Verlauf</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Farbe 1</label>
          <input
            type="color"
            value={background.color1}
            onChange={(e) => update({ color1: e.target.value })}
          />
        </div>
        {background.type === 'gradient' && (
          <>
            <div className="form-group">
              <label>Farbe 2</label>
              <input
                type="color"
                value={background.color2}
                onChange={(e) => update({ color2: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Richtung</label>
              <select
                value={background.gradientDirection}
                onChange={(e) => update({ gradientDirection: e.target.value })}
              >
                <option value="vertical">Vertikal</option>
                <option value="horizontal">Horizontal</option>
                <option value="diagonal">Diagonal</option>
                <option value="radial">Radial</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
