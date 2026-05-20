"use client";

import Image from "next/image";
import { canOptimizeNewsImage, normalizeNewsImageUrl } from "@/lib/news-image";

interface NewsThumbnailProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function NewsThumbnail({ src, alt, priority = false }: NewsThumbnailProps) {
  const normalizedSrc = normalizeNewsImageUrl(src);
  const className =
    "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]";

  if (!canOptimizeNewsImage(normalizedSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalizedSrc}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
      className={className}
      priority={priority}
    />
  );
}
