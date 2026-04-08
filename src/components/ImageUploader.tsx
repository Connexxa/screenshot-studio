import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import type { UploadedImage } from '../types';

interface Props {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
}

export function ImageUploader({ images, onImagesChange }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file) => {
        const url = URL.createObjectURL(file);
        return new Promise<UploadedImage>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              id: crypto.randomUUID(),
              file,
              url,
              width: img.width,
              height: img.height,
              name: file.name,
            });
          };
          img.src = url;
        });
      });

      Promise.all(newImages).then((loaded) => {
        onImagesChange([...images, ...loaded]);
      });
    },
    [images, onImagesChange]
  );

  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.url);
    onImagesChange(images.filter((i) => i.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
  });

  return (
    <div className="image-uploader">
      <h3>
        <ImageIcon size={18} /> Quellbilder
      </h3>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload size={24} />
        <p>Screenshots hier ablegen oder klicken</p>
        <span className="dropzone-hint">PNG, JPG, WEBP</span>
      </div>

      {images.length > 0 && (
        <div className="image-list">
          {images.map((img, index) => (
            <div key={img.id} className="image-item">
              <img src={img.url} alt={img.name} className="image-thumb" />
              <div className="image-info">
                <span className="image-name">
                  {index + 1}. {img.name}
                </span>
                <span className="image-dims">
                  {img.width} x {img.height}
                </span>
              </div>
              <button
                className="btn-icon"
                onClick={() => removeImage(img.id)}
                title="Entfernen"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
