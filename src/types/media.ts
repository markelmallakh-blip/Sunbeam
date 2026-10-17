type MediaBase = {
  src: string;
  /** Intrinsic size of the source file — required to reserve space and avoid layout shift. */
  width: number;
  height: number;
};

export type ImageAsset = MediaBase & {
  type: "image";
  /** Empty string marks the image as decorative. */
  alt: string;
};

export type VideoAsset = MediaBase & {
  type: "video";
  /** Accessible description of the video content. */
  label: string;
  poster?: string;
  mimeType?: `video/${string}`;
};

export type MediaAsset = ImageAsset | VideoAsset;
