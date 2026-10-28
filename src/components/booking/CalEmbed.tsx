import { siteConfig } from "@/config/site";
import { BookingWidget } from "@/components/sections/BookingWidget";
import { cn } from "@/lib/cn";

/*
 * Figma "Cal.com Embed (iframe)": the studio's Cal.com booking page, framed. Until
 * NEXT_PUBLIC_CAL_LINK is set, the built-in booking card (a replica of the same layout) stands in.
 */
export function CalEmbed({ className }: { className?: string }) {
  if (!siteConfig.calLink) {
    return <BookingWidget />;
  }

  const src = `https://cal.com/${siteConfig.calLink}?embed=true&layout=month_view&theme=light`;
  return (
    <iframe
      src={src}
      title="Book a design consultation"
      loading="lazy"
      className={cn("block size-full min-h-[33rem] w-full border-0 bg-white", className)}
    />
  );
}
