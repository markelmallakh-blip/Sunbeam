import { team } from "@/content/about";
import { ParallaxBanner } from "@/components/media/ParallaxBanner";

/* The full-bleed team photo between the values and the purpose rows. */
export function Team() {
  return <ParallaxBanner asset={team.image} label={team.title} />;
}
