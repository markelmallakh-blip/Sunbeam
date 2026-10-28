import Image from "next/image";
import type { ImageAsset } from "@/types/media";
import { cn } from "@/lib/cn";

export type ResponsiveImageProps = {
  asset: ImageAsset;
  /** Rendered width hints for the browser, e.g. "(min-width: 1024px) 40vw, 100vw". */
  sizes: string;
  /** Above-the-fold media only: loads eagerly with high fetch priority. */
  priority?: boolean;
  /** Fill the positioned parent (object-fit cover) instead of using intrinsic dimensions. */
  fill?: boolean;
  quality?: 75 | 85;
  /** Filled frames drift gently on scroll (SmoothScroll); pass false for static images. */
  parallax?: boolean;
  className?: string;
};

export function ResponsiveImage({
  asset,
  sizes,
  priority = false,
  fill = false,
  quality = 75,
  parallax = true,
  className,
}: ResponsiveImageProps) {
  const loading = priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {};

  if (fill) {
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        quality={quality}
        data-parallax={parallax || undefined}
        style={
          asset.focus || asset.zoom
            ? { objectPosition: asset.focus, scale: asset.zoom, transformOrigin: asset.focus }
            : undefined
        }
        className={cn("object-cover", className)}
        {...loading}
      />
    );
  }

  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      quality={quality}
      className={cn("h-auto w-full", className)}
      {...loading}
    />
  );
}
