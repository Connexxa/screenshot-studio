import { Type } from 'lucide-react';
import type { TextOverlay } from '../types';

interface Props {
  overlay: TextOverlay;
  onChange: (overlay: TextOverlay) => void;
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica Neue',
  'Inter',
  'Segoe UI',
  'Roboto',
  'SF Pro Display',
  'Georgia',
  'Times New Roman',
];

export function TextOverlayEditor({ overlay, onChange }: Props) {
  const update = (partial: Partial<TextOverlay>) => {
    onChange({ ...overlay, ...partial });
  };

  return (
    <div className="text-overlay-editor">
      <h3>
        <Type size={18} /> Text Overlay
      </h3>

      <div className="form-group">
        <label>Text</label>
        <textarea
          value={overlay.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="z.B. Ihre App, schneller als je zuvor"
          rows={2}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Position</label>
          <select
            value={overlay.position}
            onChange={(e) => update({ position: e.target.value as TextOverlay['position'] })}
          >
            <option value="top">Oben</option>
            <option value="center">Mitte</option>
            <option value="bottom">Unten</option>
          </select>
        </div>

        <div className="form-group">
          <label>Grösse</label>
          <input
            type="range"
            min={20}
            max={80}
            value={overlay.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
          />
          <span className="range-value">{overlay.fontSize}</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Schriftart</label>
          <select
            value={overlay.fontFamily}
            onChange={(e) => update({ fontFamily: e.target.value })}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={overlay.bold}
              onChange={(e) => update({ bold: e.target.checked })}
            />{' '}
            Fett
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Textfarbe</label>
          <input
            type="color"
            value={overlay.color}
            onChange={(e) => update({ color: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Hintergrund</label>
          <input
            type="color"
            value={overlay.backgroundColor === 'transparent' ? '#000000' : overlay.backgroundColor}
            onChange={(e) => update({ backgroundColor: e.target.value })}
          />
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={overlay.backgroundColor === 'transparent'}
              onChange={(e) =>
                update({ backgroundColor: e.target.checked ? 'transparent' : '#000000' })
              }
            />{' '}
            Transparent
          </label>
        </div>
      </div>
    </div>
  );
}
