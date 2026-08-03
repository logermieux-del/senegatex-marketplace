'use client';

import { useState } from 'react';

interface PhotoUploadProps {
  onPhotosChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    if (photos.length + files.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const newPhotos: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'listings');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Upload failed');
        }

        const data = await res.json();
        newPhotos.push(data.url);
      }

      const allPhotos = [...photos, ...newPhotos];
      setPhotos(allPhotos);
      onPhotosChange(allPhotos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onPhotosChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Photos ({photos.length}/{maxPhotos})
      </label>

      {/* Upload area */}
      <label className="block border-2 border-dashed border-accent-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
        <div className="text-accent-600">
          <div className="text-2xl mb-2">📸</div>
          <p className="font-medium">Click to upload photos</p>
          <p className="text-xs text-accent-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || photos.length >= maxPhotos}
          className="hidden"
        />
      </label>

      {/* Error message */}
      {error && <p className="text-sm text-red-600 mt-2">❌ {error}</p>}

      {/* Loading state */}
      {uploading && (
        <p className="text-sm text-primary-600 mt-2">⏳ Uploading...</p>
      )}

      {/* Photo preview grid */}
      {photos.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Your Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-32 object-cover rounded border border-accent-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
                {idx === 0 && (
                  <div className="absolute bottom-1 left-1 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-accent-500 mt-2">
            First photo will be used as thumbnail
          </p>
        </div>
      )}
    </div>
  );
}
