import Image from "next/image";
import { clients } from "@/content/homepage";

/*
 * Figma "Categories" (164:4073): title, a 60px Gray 3 rule and the logos on 174px tiles 50px
 * apart. The row is wider than the frame in Figma, so it drifts as a slow marquee here
 * (paused on hover; static for reduced motion).
 */
export function Clients() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-[3.125rem] pr-[3.125rem]"
    >
      {clients.items.map((client) => (
        <li key={client.name} className="grid h-[6.5rem] w-[10.875rem] shrink-0 place-items-center">
          <Image
            src={client.logo.src}
            alt={hidden ? "" : client.name}
            width={client.logo.width}
            height={client.logo.height}
            style={{ height: client.height }}
            className="w-auto max-w-full"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-labelledby="clients-title"
      className="flex flex-col items-center gap-6 overflow-hidden bg-mist py-[clamp(5rem,4rem+2.6vw,7.5rem)]"
    >
      <h2 id="clients-title" className="text-heading-6 font-semibold text-ink">
        {clients.title}
      </h2>
      <span aria-hidden className="h-px w-[3.75rem] bg-[#c4c5c7]" />
      <div className="group mt-2 flex w-full">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
