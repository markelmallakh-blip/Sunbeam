import type { ImageAsset } from "@/types/media";
import { withBase } from "@/lib/base-path";

/*
 * Content for the built-in booking card (BookingWidget), which stands in for the Cal.com embed
 * until NEXT_PUBLIC_CAL_LINK is set. Page content lives in homepage.ts, about.ts, projects.ts…
 */

const image = (src: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src,
  alt,
  width,
  height,
});

export const consultation = {
  eyebrow: "Schedule consultation call",
  title: "Let’s Bring Your Vision to Life",
  description:
    "Have a project in mind? Schedule a consultation meeting now or send us your inquiry and let’s bring your vision to life.",
  cta: { label: "Send us message", href: "mailto:hello@sunbeam.com" },
  booking: {
    host: "Lina Magdy",
    hostImage: image(withBase("/images/home/consultant-lina.webp"), "Lina Magdy", 256, 256),
    event: "Design Consultation",
    summary: "A relaxed first conversation about your space, goals and budget.",
    details: [
      { icon: "clock", label: "30m" },
      { icon: "video", label: "Google Meet" },
      { icon: "globe", label: "Africa/Cairo" },
    ] as const,
    cta: { label: "Book a call", href: "mailto:hello@sunbeam.com?subject=Design%20consultation" },
  },
};
