import Image from "next/image";
import { clients } from "@/content/home";
import { Container } from "@/components/layout/Container";

/* Logo marquee (CSS animation — pauses on hover, stops for reduced motion). */
export function Clients() {
  return (
    <section
      aria-labelledby="clients-title"
      className="overflow-hidden bg-white pt-24 pb-24 text-ink"
    >
      <Container>
        <h2 id="clients-title" className="font-display text-quote">
          {clients.title}
        </h2>
      </Container>
      <div className="mt-12 flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex items-center gap-[4.8rem] pr-[4.8rem] pl-gutter"
          >
            {clients.items.map((client) => (
              <li key={client.name} className="flex h-28 items-center">
                <Image
                  src={client.logo.src}
                  alt={copy === 0 ? client.logo.alt : ""}
                  width={client.logo.width}
                  height={client.logo.height}
                  sizes="320px"
                  style={{ height: client.height }}
                  className="w-auto max-w-none"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
