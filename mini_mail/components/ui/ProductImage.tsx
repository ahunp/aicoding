"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  iconSize?: number;
}

export default function ProductImage({ src, alt, className = "", iconSize = 48 }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center text-muted-foreground ${className}`}>
        <Package size={iconSize} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-contain p-2 ${className}`}
      onError={() => setError(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    />
  );
}
