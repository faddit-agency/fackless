import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** 정적 파일 `public/logo-fackless.png` (브랜드 워드마크) */
export const BRAND_LOGO_SRC = "/logo-fackless.png";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt="FACKLESS 패클스"
      width={196}
      height={50}
      className={cn("h-[1.4rem] w-auto object-contain object-left", className)}
      priority={priority}
    />
  );
}

export function BrandLogoLink({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <BrandLogo priority={priority} />
    </Link>
  );
}
