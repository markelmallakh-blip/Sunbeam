import type { ImageAsset, VideoAsset } from "@/types/media";
import { withBase } from "@/lib/base-path";

/*
 * Homepage content for the 2026-10 redesign (Figma "Homepage" 90:1848 on the "UI" page). Copy and
 * sample images are taken from the Figma frame as-is. Inner pages still read src/content/home.ts
 * until they are redesigned.
 */

const image = (file: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src: withBase(`/images/home-v2/${file}.webp`),
  alt,
  width,
  height,
});

export const hero = {
  eyebrow: "Residential & Commercial Interiors in Egypt",
  title: ["Spaces Composed", "in Quiet Light."],
  /* Figma's hero film: a pergola's fabric shades, 720 × 1280, 14.6s, looping. */
  poster: image(
    "hero-poster-v2",
    "Fabric shades stretched between timber beams of a pergola",
    720,
    1280,
  ),
  video: {
    type: "video",
    src: withBase("/videos/hero-v2.webm"),
    mimeType: "video/webm",
    width: 720,
    height: 1280,
    label: "Fabric shades stretched between timber beams of a pergola, moving gently in the wind",
  } as VideoAsset | null,
  /* The original MP4 for browsers without WebM (VP9) playback, such as older Safari. */
  videoFallback: withBase("/videos/hero-v2.mp4"),
};

export const story = {
  title: "Our Story",
  text: "Founded by Lina Magdy, Sunbeam Design Studio creates spaces that blend style, comfort and function through thoughtful design, smart space planning and carefully chosen furniture and finishes.",
  cta: { label: "About us", href: "/about" },
  image: image("story-founder", "Lina Magdy, founder of Sunbeam Design Studio", 1086, 1448),
};

export type ServiceCard = {
  title: string;
  description: string;
  href: string;
  image: ImageAsset;
};

export const services = {
  title: "Our Services",
  description:
    "We create cohesive spaces through thoughtful interior design and carefully selected furniture, fixtures, and finishes.",
  items: [
    {
      title: "Interior Design",
      description:
        "We create thoughtful spaces through smart planning, creative concepts, and designs tailored to your needs.",
      href: "/services/interior-design",
      image: image(
        "service-interior",
        "Open-plan dining and living room with pendant lights and timber finishes",
        1600,
        1231,
      ),
    },
    {
      title: "(FF&E) Solution",
      description:
        "We deliver turnkey FF&E, from furniture and lighting selection to the final finishing touches.",
      href: "/services/ffe",
      image: {
        ...image(
          "service-ffe-2k",
          "Modular sofa with striped cushions around a round stone coffee table",
          2000,
          2222,
        ),
        focus: "50% 62%",
      },
    },
  ] satisfies ServiceCard[],
};

export type ProjectCard = {
  title: string;
  tags: string[];
  href: string;
  image: ImageAsset;
};

export const projects = {
  title: "Selected Projects",
  description: "Thoughtful design and refined details bring each space to life.",
  cta: { label: "View all", href: "/projects" },
  items: [
    {
      title: "Sodic Villette",
      tags: ["Residential", "FF&E", "New Cairo"],
      href: "/projects/sodic-villette",
      image: image(
        "projects/sodic-villette",
        "Sodic Villette living room with a green lounge chair and a sculpted coffee table",
        1200,
        923,
      ),
    },
    {
      title: "Baxters Restaurant",
      tags: ["Commercial", "Interior Design", "New Cairo"],
      href: "/projects/baxters",
      image: image(
        "projects/baxters",
        "Baxters restaurant with timber beams, pendant lights and a monochrome tiled floor",
        1200,
        1440,
      ),
    },
    {
      title: "LA7 Zoya Clubhouse",
      tags: ["Commercial", "Interior Design", "North Coast"],
      href: "/projects/la7-zoya",
      image: image(
        "projects/la7-zoya",
        "LA7 Zoya clubhouse gym under a timber ceiling with exposed ducts",
        1145,
        1374,
      ),
    },
    {
      title: "Almaza Bay Villa",
      tags: ["Residential", "FF&E"],
      href: "/projects/almaza-bay",
      image: image(
        "projects/almaza-bay",
        "Almaza Bay villa living room opening onto a sea view",
        1200,
        800,
      ),
    },
    {
      title: "FAMM Dental Clinic",
      tags: ["Commercial", "Interior Design", "El Sheikh Zayed"],
      href: "/projects/famm-dental",
      image: image(
        "projects/famm-dental",
        "FAMM dental clinic waiting area with a blue door and framed prints",
        1200,
        1440,
      ),
    },
    {
      title: "Kalethia Apartment",
      tags: ["Residential", "Interior Design", "Greece"],
      href: "/projects/kalethia",
      image: image(
        "projects/kalethia",
        "Kalethia apartment dining nook with a round timber table on a woven rug",
        1200,
        1333,
      ),
    },
  ] satisfies ProjectCard[],
};

export type ClientLogo = {
  name: string;
  logo: ImageAsset;
  /** Rendered height in px inside the 174px Figma tile. */
  height: number;
};

const client = (file: string, name: string, w: number, h: number, height: number): ClientLogo => ({
  name,
  logo: image(`partners/${file}`, name, w, h),
  height,
});

export const clients = {
  title: "Proudly Worked With",
  /* Logos sit on the section grey (baked into the files); heights match the 174px Figma tiles. */
  items: [
    client("la7", "LA7", 504, 236, 59),
    client("almaza-bay", "Almaza Bay", 640, 71, 19),
    client("pottery-cafe", "Pottery Café", 422, 339, 85),
    client("baxters", "Bäxters European Kitchen", 525, 400, 101),
    client("wonderville", "Wonderville", 640, 196, 52),
    client("playa", "Playa", 640, 93, 26),
    client("palm-hills", "Palm Hills Developments", 474, 130, 48),
    client("sodic", "SODIC", 1280, 330, 45),
  ] satisfies ClientLogo[],
};

export type Faq = { question: string; answer: string };

export const faqs = {
  title: "Frequently Asked Questions",
  description: "We believe great design starts with clarity and trust",
  cta: { label: "View all FAQs", href: "/faqs" },
  items: [
    {
      question: "What services does Sunbeam Design Studio offer?",
      answer:
        "We offer full interior design and FF&E services for residential and commercial spaces from concept, space planning and 3D vizualisation to sourcing, procurement and on-site supervision until handover.",
    },
    {
      question: "Do you work on both residential and commercial projects?",
      answer:
        "Yes. Our portfolio spans apartments, coastal homes and villas as well as cafés, restaurants, clinics, offices and clubhouses.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "Timelines depend on the size and scope of the space. We share a clear schedule after the first consultation and keep you updated at every milestone.",
    },
    {
      question: "How is your design fee calculated?",
      answer:
        "Fees are based on the project area, scope and the level of service you need. You receive a detailed proposal after we understand your brief.",
    },
    {
      question: "Can you work with my existing furniture?",
      answer:
        "Absolutely. We can integrate pieces you love into the new design and source only what is needed to complete the space.",
    },
    {
      question: "Do you take on projects outside Egypt?",
      answer:
        "Yes. We work with clients abroad, combining remote design sessions with trusted local partners.",
    },
  ] satisfies Faq[],
};

/* The homepage shows the first three posts from src/content/blog.ts. */
export const blog = {
  title: "Blog & News",
  description: "We believe great design starts with clarity and trust",
  cta: { label: "Explore blog", href: "/blog" },
  count: 3,
};

export const consultation = {
  eyebrow: "Schedule consultation call",
  title: "Let’s Discuss Your Next Space Design",
  description:
    "Have a project in mind? schedule now consultation meeting or send us your inquiry and let's bring your vision to life,",
  cta: { label: "Send us message", href: "/contact" },
};

export const newsletter = {
  title: "Join Our Newsletter for Exclusive Updates and News",
  note: "by subscribing you are agreeing on our privacy policy",
};
