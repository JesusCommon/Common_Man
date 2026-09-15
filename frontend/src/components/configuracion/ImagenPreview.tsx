import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";

interface ImagePreviewProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: "square" | "banner";
  placeholder?: string;
}

export function ImagePreview({
  label,
  value,
  onChange,
  aspectRatio = "square",
  placeholder = "https://ejemplo.com/imagen.jpg",
}: ImagePreviewProps) {
  const [tempUrl, setTempUrl] = useState(value);
  const [error, setError] = useState(false);

  const isBanner = aspectRatio === "banner";

  function handleBlur() {
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
    }
  }

  function handleClear() {
    setTempUrl("");
    onChange("");
    setError(false);
  }

  function handleImageError() {
    setError(true);
  }

  function handleImageLoad() {
    setError(false);
  }

  const inputBlock = (
    <div className="flex-1 min-w-0">
      <input
        type="url"
        value={tempUrl}
        onChange={(e) => {
          setTempUrl(e.target.value);
          setError(false);
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error ? (
        <p className="mt-1 text-xs text-red-500">
          No se pudo cargar la imagen. Verifica la URL.
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">
          Pega la URL de una imagen. Se mostrará una vista previa.
        </p>
      )}
    </div>
  );

  const previewBlock = (
    <div
      className={`relative bg-gray-100 border border-gray-200 overflow-hidden shrink-0 ${
        isBanner ? "w-full h-32 rounded-lg" : "w-24 h-24 rounded-lg"
      }`}
    >
      {tempUrl && !error ? (
        <>
          <img
            src={tempUrl}
            alt={label}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition"
            title="Quitar imagen"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <ImageIcon className="w-6 h-6" />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {isBanner ? (
        <div className="space-y-3">
          {previewBlock}
          {inputBlock}
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {previewBlock}
          {inputBlock}
        </div>
      )}
    </div>
  );
}