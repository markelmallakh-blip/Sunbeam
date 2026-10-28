import Image from "next/image";
import type { Project } from "@/content/projects";

/*
 * Figma "Our Art in Detail" (115:5655): title and statement, five 100px material swatches, then
 * the selected pieces as cut-outs on a row of 200px tiles.
 */
export function ProjectDetail({ detail }: { detail: NonNullable<Project["detail"]> }) {
  return (
    <section
      aria-labelledby="detail-title"
      className="flex flex-col items-center gap-stack px-edge pt-block text-center lg:gap-20"
    >
      <div className="flex flex-col items-center gap-2">
        <h2 id="detail-title" className="text-heading-4 font-semibold text-ink">
          {detail.title}
        </h2>
        <p className="max-w-[37rem] text-heading-6 font-normal tracking-[0.5px] text-ink">
          {detail.text}
        </p>
      </div>
      <ul aria-label="Material palette" className="flex flex-wrap justify-center gap-3">
        {detail.palette.map((color) => (
          <li key={color} className="size-16 sm:size-[6.25rem]" style={{ backgroundColor: color }}>
            <span className="sr-only">{color}</span>
          </li>
        ))}
      </ul>
      <ul className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[1.9375rem]">
        {detail.pieces.map((piece) => (
          <li key={piece.src} className="relative h-[12.5rem]">
            <Image
              src={piece.src}
              alt={piece.alt}
              fill
              sizes="(min-width: 1024px) 18vw, 45vw"
              className="object-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
