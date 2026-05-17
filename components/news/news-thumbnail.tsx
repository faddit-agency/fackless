"use client";

import Image from "next/image";
import { canOptimizeNewsImage } from "@/lib/news-image";

interface NewsThumbnailProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function NewsThumbnail({ src, alt, priority = false }: NewsThumbnailProps) {
  const className =
    "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]";

  if (!canOptimizeNewsImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
      className={className}
      priority={priority}
    />
  );
}
