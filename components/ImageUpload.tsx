"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import ProductImage from "@/components/ProductImage";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Product photo",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      toast.success("Image uploaded to Cloudinary");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </label>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary text-sm disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload from device"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-red-400/80 hover:text-red-300"
          >
            Remove image
          </button>
        )}
      </div>

      {value ? (
        <div className="relative w-40 h-52 rounded-xl overflow-hidden border border-white/10">
          <ProductImage
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <p className="text-white/35 text-xs">
          JPG, PNG or WebP — max 5 MB. Stored on Cloudinary free tier.
        </p>
      )}

      <div>
        <p className="text-white/35 text-xs mb-2">Or paste image URL manually</p>
        <input
          type="url"
          placeholder="https://res.cloudinary.com/..."
          className="input-field text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
