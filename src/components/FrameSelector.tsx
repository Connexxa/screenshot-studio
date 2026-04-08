import { Smartphone } from 'lucide-react';
import type { DeviceFrame } from '../types';
import { deviceFrames } from '../data/deviceFrames';

interface Props {
  selectedFrameId: string | null;
  onFrameChange: (frameId: string | null) => void;
}

export function FrameSelector({ selectedFrameId, onFrameChange }: Props) {
  const iosFrames = deviceFrames.filter((f) => f.platform === 'ios' && f.id !== 'none');
  const androidFrames = deviceFrames.filter((f) => f.platform === 'android');

  const renderFrame = (frame: DeviceFrame) => (
    <button
      key={frame.id}
      className={`frame-option ${selectedFrameId === frame.id ? 'frame-selected' : ''}`}
      onClick={() => onFrameChange(frame.id === selectedFrameId ? null : frame.id)}
    >
      <div
        className="frame-preview"
        style={{
          backgroundColor: frame.color,
          borderRadius: frame.borderRadius / 10,
          border: frame.color === 'transparent'
            ? '2px dashed var(--border)'
            : `2px solid ${frame.color === '#1a1a1a' ? '#333' : frame.color}`,
        }}
      >
        <div
          className="frame-screen"
          style={{
            borderRadius: (frame.borderRadius / 10) * 0.7,
          }}
        />
      </div>
      <span className="frame-name">{frame.name}</span>
    </button>
  );

  return (
    <div className="frame-selector">
      <h3>
        <Smartphone size={18} /> Device Frame
      </h3>

      <button
        className={`frame-option ${selectedFrameId === null || selectedFrameId === 'none' ? 'frame-selected' : ''}`}
        onClick={() => onFrameChange(null)}
      >
        <div className="frame-preview frame-none">
          <span>Kein</span>
        </div>
        <span className="frame-name">Kein Rahmen</span>
      </button>

      <div className="frame-group">
        <h4>iOS</h4>
        <div className="frame-grid">
          {iosFrames.map(renderFrame)}
        </div>
      </div>

      <div className="frame-group">
        <h4>Android</h4>
        <div className="frame-grid">
          {androidFrames.map(renderFrame)}
        </div>
      </div>
    </div>
  );
}
