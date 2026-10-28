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
  /** Where a cropped (filled) frame centres on the photo, as CSS object-position, e.g. "50% 80%". */
  focus?: string;
  /** Extra zoom for a filled frame (1 = none), scaled about the focus point. */
  zoom?: number;
};

export type VideoAsset = MediaBase & {
  type: "video";
  /** Accessible description of the video content. */
  label: string;
  poster?: string;
  mimeType?: `video/${string}`;
};

export type MediaAsset = ImageAsset | VideoAsset;
