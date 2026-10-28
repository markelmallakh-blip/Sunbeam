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
  title: ["Spaces Composed", "In Quiet Light."],
  /*
   * Figma fills the hero with a video of a pergola's fabric shades. Figma cannot export video
   * fills, so the still frame plays the part until the film file is added as hero-v2.webm.
   */
  poster: image(
    "hero-poster",
    "Fabric shades stretched between timber beams of a pergola",
    720,
    1280,
  ),
  video: null as VideoAsset | null,
};

export const story = {
  title: "Sunbeam Story",
  lead: "At Sunbeam Design Studio, we create spaces that blend style, comfort, ",
  leadMuted:
    "and function through thoughtful design, smart space planning, and carefully chosen furniture and finishes.",
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
      href: "/#services",
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
      href: "/#services",
      image: image(
        "service-ffe",
        "Modular sofa with striped cushions around a round stone coffee table",
        1600,
        1778,
      ),
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
  cta: { label: "View all", href: "/#projects" },
  items: [
    {
      title: "Sodic Villette",
      tags: ["Residential", "FF&E", "New Cairo"],
      href: "/#projects",
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
      href: "/#projects",
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
      href: "/#projects",
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
      href: "/#projects",
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
      href: "/#projects",
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
  title: "Frequently asked questions",
  description: "We believe great design starts with clarity and trust",
  cta: { label: "View all FAQs", href: "/#faqs" },
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

export type BlogPost = {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
  image: ImageAsset;
};

const expoImage = image(
  "blog/design-show-expo",
  "Bright bedroom with a patterned throw and a mirrored wardrobe",
  1200,
  923,
);

export const blog = {
  title: "Blog & News",
  description: "We believe great design starts with clarity and trust",
  cta: { label: "Explore blog", href: "/#blog" },
  items: [
    {
      category: "News",
      date: "18 - 20 Nov 2026",
      title: "Meet Us at The Design Show Expo",
      excerpt:
        "Explore how to combine aesthetics and practicality to create interiors that feel beautiful, comfortable, and effortless to live in.",
      href: "/#blog",
      image: expoImage,
    },
    {
      category: "Blog",
      date: "21 Oct 2026",
      title: "5 Ways to Balance Your Space Colors",
      excerpt:
        "Explore how to combine aesthetics and practicality to create interiors that feel beautiful, comfortable, and effortless to live in.",
      href: "/#blog",
      image: expoImage,
    },
    {
      category: "Blog",
      date: "21 Oct 2026",
      title: "2027 Bathrooms Trends",
      excerpt:
        "Discover how thoughtful design, natural materials, and carefully selected details create spaces that remain beautiful beyond trends.",
      href: "/#blog",
      image: image(
        "blog/bathroom-trends",
        "Bathroom vanity with a round mirror, brass taps and green tiles",
        1200,
        1333,
      ),
    },
  ] satisfies BlogPost[],
};

export const consultation = {
  eyebrow: "Schedule consultation call",
  title: "Words of Trust and Appreciation",
  description:
    "Have a project in mind? schedule now consultation meeting or send us your inquiry and let's bring your vision to life,",
  cta: { label: "Send us message", href: "mailto:hello@sunbeam.com" },
};

export const newsletter = {
  title: "Join our newsletter for exclusive updates and news",
  note: "by subscribing you are agreeing on our privacy policy",
};
