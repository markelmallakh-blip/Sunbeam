import Image from "next/image";
import { Fragment } from "react";
import { careersPage } from "@/content/careers";
import { withBase } from "@/lib/base-path";

/*
 * A large centred statement with small rounded studio photos set into its lines, sized to the
 * type so they sit like words. `{n}` in the copy marks where photo n goes.
 */
export function InlineStatement() {
  const { text, photos } = careersPage.statement;
  const parts = text.split(/\{(\d)\}/);

  return (
    <section aria-label="Life at Sunbeam" className="bg-white px-edge pb-block">
      <p className="mx-auto max-w-[72rem] text-center text-[clamp(1.75rem,1.1rem+2.7vw,4rem)] leading-[1.25] font-medium tracking-[-0.01em] text-ink">
        {parts.map((part, index) => {
          if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
          const photo = photos[Number(part)];
          return photo ? (
            <span
              key={index}
              className="relative mx-[0.12em] [display:inline-block] h-[0.82em] w-[1.7em] overflow-hidden rounded-full align-[-0.08em]"
            >
              <Image
                src={withBase(photo.src)}
                alt={photo.alt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </span>
          ) : null;
        })}
      </p>
    </section>
  );
}
