import { team } from "@/content/about";
import { ParallaxBanner } from "@/components/media/ParallaxBanner";

/* The full-bleed team photo, 16:9 at every size, between the values and the purpose rows. */
export function Team() {
  return <ParallaxBanner asset={team.image} label={team.title} frameClassName="aspect-[16/9]" />;
}
