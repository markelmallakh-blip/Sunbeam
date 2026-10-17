import type { MediaAsset } from "@/types/media";
import { ResponsiveImage } from "./ResponsiveImage";
import { Video } from "./Video";

type MediaProps = {
  asset: MediaAsset;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  /** Video only: ambient muted playback. */
  autoPlay?: boolean;
  className?: string;
};

/* Single entry point for content media — swap an image for a video in content data, not in components. */
export function Media({ asset, sizes, priority, fill, autoPlay, className }: MediaProps) {
  if (asset.type === "video") {
    return (
      <Video
        asset={asset}
        priority={priority}
        fill={fill}
        autoPlay={autoPlay}
        className={className}
      />
    );
  }
  return (
    <ResponsiveImage
      asset={asset}
      sizes={sizes}
      priority={priority}
      fill={fill}
      className={className}
    />
  );
}
