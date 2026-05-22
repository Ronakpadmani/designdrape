type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fill?: boolean;
};

export default function ProductImage({
  src,
  alt,
  className = "",
  fill = false,
}: ProductImageProps) {
  const hasImage = Boolean(src?.trim());

  if (!hasImage) {
    return (
      <div
        className={`flex items-center justify-center bg-white/[0.04] text-white/30 text-sm ${className}`}
      >
        No image
      </div>
    );
  }

  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <img src={src} alt={alt} className={className} />
  );
}
