"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ImageAsset } from "@/types/media";
import { useGsap } from "@/hooks/useGsap";
import { gsap } from "@/lib/gsap";
import { inkWords } from "@/lib/ink-words";
import { ScrollInk } from "@/components/animations/ScrollInk";
import { FounderSignature } from "@/components/brand/FounderSignature";

type FounderLetterProps = {
  paragraphs: string[];
  portrait: ImageAsset;
  name: string;
  role: string;
};

const TILT = -5.32; // Figma tilt of the floating portrait, deg

/*
 * The founder's letter with one travelling portrait. The photo starts large and tilted beside
 * the top-right of the letter (Figma 68:1433), rides down the right margin with the reading,
 * then shrinks, straightens and glides in to settle in its place under the last paragraph. As it
 * lands, the signature writes itself in and the title types out; scrolling back up undoes both.
 * Reduced motion shows the portrait in place with the sign-off already written.
 */
export function FounderLetter({ paragraphs, portrait, name, role }: FounderLetterProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useGsap(({ reduceMotion }) => {
    const frame = frameRef.current;
    const slot = slotRef.current;
    const photo = photoRef.current;
    if (reduceMotion || !frame || !slot || !photo) return;

    // Offsets from the resting slot to the starting spot, re-measured on every refresh.
    const geometry = { dx: 0, dy: 0, startScale: 1, endScale: 1, sway: 0 };
    const measure = () => {
      const frameBox = frame.getBoundingClientRect();
      const slotBox = slot.getBoundingClientRect();
      const width = photo.offsetWidth;
      const height = photo.offsetHeight;
      const startScale = Math.min(1, (frameBox.width * 0.42) / width);
      const startWidth = width * startScale;
      const startX = Math.min(
        frameBox.width * 0.892 + startWidth / 2,
        frameBox.width - startWidth / 2,
      );
      const startY = -50 + (height * startScale) / 2;
      geometry.dx = startX - (slotBox.left - frameBox.left + slotBox.width / 2);
      geometry.dy = startY - (slotBox.top - frameBox.top + slotBox.height / 2);
      geometry.startScale = startScale;
      geometry.endScale = slotBox.width / width;
      geometry.sway = Math.min(70, frameBox.width * 0.05);
    };

    const settle = gsap.parseEase("power2.inOut");
    /* Share of the trip spent riding down the right margin before gliding in to land. */
    const RIDE = 0.62;
    const render = (p: number) => {
      const { dx, dy, startScale, endScale, sway } = geometry;
      const landing = settle(gsap.utils.clamp(0, 1, (p - RIDE) / (1 - RIDE)));
      const shrink = settle(gsap.utils.clamp(0, 1, (p - 0.4) / 0.6));
      // A gentle side-to-side drift while riding, fading out as it lands.
      const drift = Math.sin(p * Math.PI * 3) * (1 - landing);
      gsap.set(photo, {
        xPercent: -50,
        yPercent: -50,
        x: dx * (1 - landing) + sway * 0.25 * drift,
        y: dy * (1 - p),
        rotation: TILT * (1 - landing) + 2 * drift,
        scale: startScale + (endScale - startScale) * shrink,
      });
    };

    measure();
    const travel = { p: 0 };
    gsap.to(travel, {
      p: 1,
      ease: "none",
      onUpdate: () => render(travel.p),
      scrollTrigger: {
        trigger: frame,
        start: "top 60%", // from here it rides at roughly the same height on screen
        endTrigger: slot,
        end: "center 68%",
        scrub: 1.2,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          render(travel.p);
        },
      },
    });
    render(0);

    // Sign-off: the signature wipes in left to right like a pen stroke, then the title types out.
    const signature = frame.querySelector("[data-signature]");
    const letters = frame.querySelectorAll("[data-letter]");
    const write = gsap
      .timeline({ paused: true })
      .fromTo(
        signature,
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power1.inOut" },
      )
      .fromTo(
        letters,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: "power2.out" },
        0.7,
      );
    gsap.timeline({
      scrollTrigger: {
        trigger: slot,
        start: "center 68%", // the moment the portrait lands
        end: "max",
        onEnter: () => write.play(),
        onLeaveBack: () => write.reverse(),
      },
    });
  }, frameRef);

  return (
    <div ref={frameRef} className="relative w-full max-w-[80rem]">
      <figure className="mx-auto flex max-w-[65.375rem] flex-col items-center gap-4">
        <ScrollInk>
          <blockquote className="flex flex-col gap-[1.3em] text-center text-statement leading-[1.3]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{inkWords(paragraph)}</p>
            ))}
          </blockquote>
        </ScrollInk>

        <figcaption className="flex flex-col items-center gap-0.5 text-center">
          {/* Resting place; the portrait is sized for its large starting state and scaled down here. */}
          <div ref={slotRef} className="relative z-10 h-[7.9375rem] w-[6.375rem]">
            <div
              ref={photoRef}
              className="absolute top-1/2 left-1/2 aspect-[102/127] w-[11.55rem] will-change-transform"
              style={{ transform: "translate(-50%, -50%) scale(0.552)" }}
            >
              <Image
                src={portrait.src}
                alt=""
                fill
                sizes="190px"
                className="object-cover shadow-[0_18px_40px_-20px_rgb(44_41_41/0.45)]"
              />
            </div>
          </div>
          <span data-signature className="mt-1 block">
            <FounderSignature className="h-10 w-auto text-rust" />
          </span>
          <span className="sr-only">
            {name}, {role}
          </span>
          <span aria-hidden className="text-body text-slate">
            {[...role].map((letter, index) => (
              <span key={index} data-letter className="inline-block whitespace-pre">
                {letter}
              </span>
            ))}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
