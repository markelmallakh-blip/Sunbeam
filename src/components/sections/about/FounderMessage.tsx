import { founder } from "@/content/about";
import { Reveal } from "@/components/animations/Reveal";
import { FounderLetter } from "./FounderLetter";

/* Figma "Founder Message" (68:1421). */
export function FounderMessage() {
  return (
    <section aria-labelledby="founder-title" className="overflow-x-clip bg-white py-20 text-ink">
      <div className="mx-auto flex max-w-site flex-col items-center gap-8 px-gutter">
        <Reveal>
          <h2 id="founder-title" className="font-display text-h4">
            {founder.title}
          </h2>
        </Reveal>
        <FounderLetter
          paragraphs={founder.paragraphs}
          portrait={founder.portrait}
          name={founder.name}
          role={founder.role}
        />
      </div>
    </section>
  );
}
