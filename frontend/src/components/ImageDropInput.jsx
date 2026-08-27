import { useRef, useState } from "react";

// Mirrors backend limits exactly (app/services/product.py -> cloudinary_upload):
// jpeg/png/webp/jpg only, max 2MB.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

export default function ImageDropInput({ id, label, value, onChange, error, hint }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) {
      onChange(null, "");
      setPreview(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      onChange(null, "Only JPG, PNG, or WEBP images are allowed.");
      setPreview(null);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      onChange(null, "Image must be 2MB or smaller.");
      setPreview(null);
      return;
    }
    onChange(file, "");
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-hand text-lg leading-none text-ink-soft">
          {label}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-4 py-6 text-center transition-colors ${
          error ? "border-pin" : "border-ink/20 hover:border-tape"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Selected preview"
            className="h-32 w-32 rounded-sm object-cover shadow-card"
          />
        ) : (
          <>
            <span className="font-hand text-lg text-ink-soft">
              Tap to choose a photo
            </span>
            <span className="text-xs text-ink-soft/70">JPG, PNG or WEBP · up to 2MB</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value && !error && (
        <button
          type="button"
          onClick={() => {
            handleFile(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="self-start text-xs font-semibold text-pin hover:underline"
        >
          Remove photo
        </button>
      )}

      {hint && !error && <span className="text-xs text-ink-soft/80">{hint}</span>}
      {error && <span className="text-xs font-medium text-pin">{error}</span>}
    </div>
  );
}
