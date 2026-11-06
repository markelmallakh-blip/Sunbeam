import Image from "next/image";
import { Fragment } from "react";
import { careersPage } from "@/content/careers";
import { withBase } from "@/lib/base-path";
import { Button } from "@/components/ui/Button";

/*
 * A large centred statement with small rounded studio photos set into its lines, sized to the
 * type so they sit like words. `{n}` in the copy marks where photo n goes.
 */
export function InlineStatement() {
  const { text, photos } = careersPage.statement;
  const parts = text.split(/\{(\d)\}/);

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10">
      <p className="mx-auto max-w-[90rem] text-center text-[clamp(1.75rem,1.1rem+2.7vw,4rem)] leading-[1.25] font-light tracking-[-0.01em] text-ink">
        {parts.map((part, index) => {
          if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
          const photo = photos[Number(part)];
          return photo ? (
            <span
              key={index}
              className="relative mx-[0.12em] [display:inline-block] h-[0.95em] w-[2.1em] overflow-hidden rounded-full align-[-0.14em]"
            >
              <Image
                src={withBase(photo.src)}
                alt={photo.alt}
                fill
                sizes="160px"
                className="object-cover"
              />
            </span>
          ) : null;
        })}
      </p>
      <Button href="#roles" variant="dark">
        {careersPage.browseRoles}
      </Button>
    </div>
  );
}
