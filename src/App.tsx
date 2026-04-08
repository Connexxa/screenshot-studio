import { useState } from 'react';
import type { UploadedImage, TextOverlay, BackgroundConfig } from './types';
import { ImageUploader } from './components/ImageUploader';
import { FormatSelector } from './components/FormatSelector';
import { FrameSelector } from './components/FrameSelector';
import { TextOverlayEditor } from './components/TextOverlayEditor';
import { BackgroundEditor } from './components/BackgroundEditor';
import { Preview } from './components/Preview';
import { ExportPanel } from './components/ExportPanel';

function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    'apple-iphone-6.9',
    'apple-ipad-13',
    'google-phone',
    'google-feature-graphic',
  ]);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(
    'iphone-16-pro-black'
  );
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    text: '',
    position: 'top',
    fontSize: 40,
    fontFamily: 'Helvetica Neue',
    color: '#ffffff',
    backgroundColor: 'transparent',
    bold: true,
  });
  const [background, setBackground] = useState<BackgroundConfig>({
    type: 'gradient',
    color1: '#667eea',
    color2: '#764ba2',
    gradientDirection: 'vertical',
  });
  const [padding, setPadding] = useState(5);

  const [activeTab, setActiveTab] = useState<'formats' | 'frame' | 'text' | 'background'>('formats');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Connexxa Screenshot Studio</h1>
        <span className="app-subtitle">App Store & Play Store Screenshots</span>
      </header>

      <div className="app-layout">
        {/* Left Panel: Image Upload */}
        <aside className="panel panel-left">
          <ImageUploader images={images} onImagesChange={setImages} />

          <div className="padding-control">
            <label>Padding: {padding}%</label>
            <input
              type="range"
              min={0}
              max={15}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
            />
          </div>
        </aside>

        {/* Center: Preview */}
        <main className="panel panel-center">
          <Preview
            images={images}
            selectedFormats={selectedFormats}
            selectedFrameId={selectedFrameId}
            textOverlay={textOverlay}
            background={background}
            padding={padding}
          />
        </main>

        {/* Right Panel: Settings & Export */}
        <aside className="panel panel-right">
          <div className="tab-bar">
            <button
              className={`tab ${activeTab === 'formats' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('formats')}
            >
              Formate
            </button>
            <button
              className={`tab ${activeTab === 'frame' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('frame')}
            >
              Rahmen
            </button>
            <button
              className={`tab ${activeTab === 'text' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Text
            </button>
            <button
              className={`tab ${activeTab === 'background' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('background')}
            >
              Hintergrund
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'formats' && (
              <FormatSelector
                selectedFormats={selectedFormats}
                onSelectedFormatsChange={setSelectedFormats}
              />
            )}
            {activeTab === 'frame' && (
              <FrameSelector
                selectedFrameId={selectedFrameId}
                onFrameChange={setSelectedFrameId}
              />
            )}
            {activeTab === 'text' && (
              <TextOverlayEditor overlay={textOverlay} onChange={setTextOverlay} />
            )}
            {activeTab === 'background' && (
              <BackgroundEditor background={background} onChange={setBackground} />
            )}
          </div>

          <div className="panel-export">
            <ExportPanel
              images={images}
              selectedFormats={selectedFormats}
              selectedFrameId={selectedFrameId}
              textOverlay={textOverlay}
              background={background}
              padding={padding}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
