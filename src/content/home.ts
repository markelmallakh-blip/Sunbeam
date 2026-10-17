import type { ImageAsset, VideoAsset } from "@/types/media";
import { withBase } from "@/lib/base-path";

/*
 * Homepage content, kept apart from presentation so copy and media can be replaced
 * (or moved to a CMS) without touching components. Copy follows the Figma "Homepage" frame.
 */

const image = (src: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src,
  alt,
  width,
  height,
});

export const announcement = "Don’t miss November offer";

export type HeroSlide = {
  label: string;
  media: VideoAsset;
};

const heroVideo = (label: string): VideoAsset => ({
  type: "video",
  src: withBase("/videos/hero.webm"),
  mimeType: "video/webm",
  label,
  poster: withBase("/images/home/hero-poster.webp"),
  width: 720,
  height: 405,
});

export const hero = {
  eyebrow: "Residential & Commercial Interiors in Egypt",
  title: "Spaces Composed In Quiet Light.",
  cta: { label: "Explore projects", href: "/#projects" },
  /** Seconds each slide plays before the next one; its tab line fills over the same time. */
  slideDuration: 7,
  /* Both slides use the same film until the commercial reel is supplied. */
  slides: [
    {
      label: "Residential",
      media: heroVideo("Sunlight rippling over a pool in a Sunbeam residential project"),
    },
    { label: "Commercial", media: heroVideo("Sunbeam commercial projects reel") },
  ] satisfies HeroSlide[],
};

export const story = {
  title: "Sunbeam Story",
  lead: "At Sunbeam Design Studio, we create spaces that blend style, comfort, and function through thoughtful design, smart space planning, and carefully chosen furniture and finishes.",
  cta: { label: "About us", href: "/about" },
  images: [
    image(
      withBase("/images/home/story-team.webp"),
      "The Sunbeam team reviewing material samples with clients in a living room",
      1440,
      1440,
    ),
    image(
      withBase("/images/home/story-lighting.webp"),
      "A Sunbeam designer adjusting a cluster of pendant lights against a warm plaster wall",
      2118,
      2648,
    ),
  ],
  teaser: {
    text: "Discover the Story Behind Sunbeam Design Studio from 2021 till today",
    label: "Watch video",
    /* Silent, cropped loop that plays in the teaser tile. */
    loop: {
      type: "video",
      src: withBase("/videos/about-teaser.webm"),
      mimeType: "video/webm",
      label: "A Sunbeam designer introducing the studio",
      poster: withBase("/images/home/about-teaser-poster.webp"),
      width: 480,
      height: 310,
    } satisfies VideoAsset,
    /* Full film with sound, opened from "Watch video". */
    film: {
      type: "video",
      src: withBase("/videos/about.mp4"),
      mimeType: "video/mp4",
      label: "The Sunbeam Design Studio story, from 2021 till today",
      poster: withBase("/images/home/about-poster.webp"),
      width: 720,
      height: 1280,
    } satisfies VideoAsset,
  },
};

export type Service = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  images: [ImageAsset, ImageAsset];
};

export const services = {
  eyebrow: "From concept to every detail",
  title: "Our Services",
  description:
    "We bring spaces to life through thoughtful interior design and carefully selected furniture, fixtures, and equipment. Every element works together to create a space that feels complete.",
  items: [
    {
      id: "interior-design",
      eyebrow: "Spaces & structure",
      title: "Interior Design",
      description:
        "We shape spaces through thoughtful planning, creative concepts, and a clear design vision tailored to each client’s needs.",
      href: "/#projects",
      images: [
        image(
          withBase("/images/home/service-interior-2.webp"),
          "Open-plan apartment living and dining area with sheer curtains and sea views",
          2400,
          1600,
        ),
        image(
          withBase("/images/home/service-interior-1.webp"),
          "Minimal grey clinic lounge with a monochrome artwork and linear lighting",
          1600,
          1920,
        ),
      ],
    },
    {
      id: "ffe",
      eyebrow: "Furniture, fixtures & equipment",
      title: "(FF&E) Solution",
      description:
        "We deliver turnkey FF&E solutions, from sourcing and selecting furniture, lighting, and finishes to coordinating every detail for a cohesive, ready-to-use space.",
      href: "/#projects",
      images: [
        image(
          withBase("/images/home/service-ffe-1.webp"),
          "Bedroom with a woven timber wardrobe, linen bedding and a pendant lamp",
          1980,
          2200,
        ),
        image(
          withBase("/images/home/service-ffe-2.webp"),
          "Round oak dining table with curved chairs on a jute rug in afternoon light",
          1980,
          2200,
        ),
      ],
    },
  ] satisfies Service[],
};

export type Project = {
  slug: string;
  title: string;
  tags: string[];
  href: string;
  cover: ImageAsset;
  detail: ImageAsset;
};

export const projects = {
  eyebrow: "Selected work",
  title: "Every Space Tells a Story.",
  description:
    "Discover our projects, where thoughtful design and refined details bring each space to life.",
  cta: { label: "View all", href: "/#projects" },
  items: [
    {
      slug: "baxters",
      title: "Baxters Restaurant",
      tags: ["Commercial", "Food & Beverage"],
      href: "/projects/baxters",
      cover: image(
        withBase("/images/projects/baxters.webp"),
        "Baxters bakery-café with timber beams, monochrome floor tiles and pendant lights",
        1600,
        1920,
      ),
      detail: image(
        withBase("/images/projects/baxters-2.webp"),
        "Baxters café seating with green chairs on a geometric tiled floor",
        1600,
        1920,
      ),
    },
    {
      slug: "sodic-villette",
      title: "Sodic Villette",
      tags: ["Residential", "Villas"],
      href: "/#projects",
      cover: image(
        withBase("/images/projects/sodic-villette.webp"),
        "Sodic Villette reception with a leather daybed, patterned rug and open kitchen",
        2400,
        1846,
      ),
      detail: image(
        withBase("/images/projects/sodic-villette-2.webp"),
        "Sodic Villette living room with a textured feature wall and corner sofa",
        1600,
        1920,
      ),
    },
    {
      slug: "la7-zoya-gym",
      title: "LA7 Zoya Gym",
      tags: ["Commercial", "Gym & Clubhouse"],
      href: "/#projects",
      cover: image(
        withBase("/images/projects/la7-zoya.webp"),
        "LA7 Zoya clubhouse façade in terracotta and sand tones behind a green lawn",
        1920,
        1080,
      ),
      detail: image(
        withBase("/images/projects/la7-zoya-2.webp"),
        "LA7 Zoya indoor gym with sculpted ring lights above training equipment",
        1920,
        1080,
      ),
    },
    {
      slug: "palm-hills-october",
      title: "Palm Hills October",
      tags: ["Residential", "Villas"],
      href: "/#projects",
      cover: image(
        withBase("/images/projects/palm-hills.webp"),
        "Palm Hills villa dining room with a long table under copper pendant lights",
        2400,
        1845,
      ),
      detail: image(
        withBase("/images/projects/palm-hills-2.webp"),
        "Palm Hills villa bedroom with a scalloped headboard and soft neutral bedding",
        2000,
        2222,
      ),
    },
    {
      slug: "wndr",
      title: "Wonderville Café",
      tags: ["Commercial", "Food & Beverage"],
      href: "/#projects",
      cover: image(
        withBase("/images/projects/wndr.webp"),
        "Wonderville café counter with a sculptural ceiling installation and terrazzo floor",
        2400,
        1600,
      ),
      detail: image(
        withBase("/images/projects/wndr-2.webp"),
        "Wonderville café dining area with planters and timber tables",
        2400,
        1600,
      ),
    },
    {
      slug: "pottery-cafe",
      title: "Pottery Café",
      tags: ["Commercial", "Food & Beverage"],
      href: "/#projects",
      cover: image(
        withBase("/images/projects/pottery.webp"),
        "Pottery Café dining hall with arched niches, olive banquettes and rattan pendants",
        2400,
        1600,
      ),
      detail: image(
        withBase("/images/projects/pottery-2.webp"),
        "Pottery Café outdoor terrace with timber pergola and olive trees",
        2400,
        1600,
      ),
    },
  ] satisfies Project[],
};

export type Client = {
  name: string;
  logo: ImageAsset;
  /** Rendered logo height in px, matching the optical sizes in the Figma logo strip. */
  height: number;
};

const logo = (
  file: string,
  name: string,
  width: number,
  height: number,
  display: number,
): Client => ({
  name,
  logo: image(withBase(`/images/clients/${file}.webp`), name, width, height),
  height: display,
});

export const clients = {
  title: "Proudly Worked With",
  items: [
    logo("la7", "LA7", 504, 236, 60),
    logo("almaza-bay", "Almaza Bay", 640, 71, 19),
    logo("pottery-cafe", "Pottery Café", 422, 339, 85),
    logo("baxters", "Bäxters European Kitchen", 525, 400, 100),
    logo("wonderville", "Wonderville", 640, 196, 54),
    logo("playa", "Playa", 640, 93, 26),
    logo("palm-hills", "Palm Hills Developments", 474, 130, 42),
  ] satisfies Client[],
};

export type Testimonial = {
  quote: string;
  author: string;
  project: string;
  image: ImageAsset;
};

export const testimonials = {
  eyebrow: "Our clients feedback",
  title: "Words of Trust and Appreciation",
  /* Placeholder testimonials from the Figma draft — replace with approved client quotes. */
  items: [
    {
      quote:
        "Sunbeam understood our home before we could describe it. Every material, every light and every corner feels considered — calm, warm and entirely ours.",
      author: "Nour & Karim El-Sayed",
      project: "Private Residence — Almaza Bay, North Coast",
      image: image(withBase("/images/home/testimonial-almaza.webp"), "", 2400, 1600),
    },
    {
      quote:
        "From the first sketch to the final styling, the process felt effortless. The team balanced our brand, our budget and our timeline with real care.",
      author: "Client name",
      project: "Commercial project — Cairo",
      image: image(withBase("/images/home/testimonial-almaza.webp"), "", 2400, 1600),
    },
    {
      quote:
        "The FF&E package arrived complete and on time. Every piece fits the space as if it was always meant to be there.",
      author: "Client name",
      project: "Private villa — New Cairo",
      image: image(withBase("/images/home/testimonial-almaza.webp"), "", 2400, 1600),
    },
  ] satisfies Testimonial[],
};

export type Faq = {
  question: string;
  answer: string;
};

export const faqs = {
  eyebrow: "Frequently asked questions",
  statement:
    "We believe great design starts with clarity and trust. Explore our frequently asked questions to learn more about our process, services, and design approach.",
  image: image(
    withBase("/images/home/faq.webp"),
    "Two Sunbeam designers sharing a high-five across a meeting table",
    1092,
    1440,
  ),
  cta: { label: "View all FAQs", href: "/#faqs" },
  items: [
    {
      question: "What services does Sunbeam Design Studio offer?",
      answer:
        "We offer full interior design and FF&E services for residential and commercial spaces, from concept, space planning and 3D visualisation to sourcing, procurement and on-site supervision until handover.",
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

export const consultation = {
  eyebrow: "Schedule consultation call",
  title: "Let’s Bring Your Vision to Life",
  description:
    "Have a project in mind? Schedule a consultation meeting now or send us your inquiry and let’s bring your vision to life.",
  cta: { label: "Send us message", href: "mailto:hello@sunbeam.com" },
  booking: {
    host: "Lina Magdy",
    hostImage: image(withBase("/images/home/consultant-lina.webp"), "Lina Magdy", 256, 256),
    event: "Design Consultation",
    summary: "A relaxed first conversation about your space, goals and budget.",
    details: [
      { icon: "clock", label: "30m" },
      { icon: "video", label: "Google Meet" },
      { icon: "globe", label: "Africa/Cairo" },
    ] as const,
    cta: { label: "Book a call", href: "mailto:hello@sunbeam.com?subject=Design%20consultation" },
  },
};

export const newsletter = {
  title: "Join our newsletter for exclusive updates and news",
};
