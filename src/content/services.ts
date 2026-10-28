import type { ImageAsset } from "@/types/media";
import type { ProjectCard } from "@/content/homepage";
import { projectHref, projectTags, projects as portfolio } from "@/content/projects";
import { withBase } from "@/lib/base-path";

/*
 * Single service pages (/services/[slug]). There is no Figma frame for them yet: the copy builds
 * on the homepage and Services menu cards, the images are the studio's own renders. Lists marked
 * "placeholder" are drafts for the studio to confirm.
 */

const image = (file: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src: withBase(`/images/services/${file}.webp`),
  alt,
  width,
  height,
});

/*
 * Related work for the carousel: the projects that used this service first, then the rest of the
 * portfolio, so there is always enough to move through.
 */
const related = (service: "Interior Design" | "FF&E"): ProjectCard[] =>
  [...portfolio]
    .sort((a, b) => Number(b.services.includes(service)) - Number(a.services.includes(service)))
    .map((project) => ({
      title: project.title,
      tags: projectTags(project),
      href: projectHref(project.slug),
      image: project.cover,
    }));

export type ServiceStep = { title: string; description: string };

export type Service = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  hero: ImageAsset;
  statement: { lead: string; muted: string };
  included: { title: string; items: ServiceStep[] };
  /** Photos shown two to a row (an even count keeps the grid full). */
  details: ImageAsset[];
  projects: ProjectCard[];
};

export const services: Service[] = [
  {
    slug: "interior-design",
    eyebrow: "Our services",
    title: "Interior Design",
    intro:
      "We create thoughtful spaces through smart planning, creative concepts, and designs tailored to your needs.",
    hero: image(
      "interior-hero",
      "Open-plan dining and living room with pendant lights and timber finishes",
      1600,
      1231,
    ),
    statement: {
      lead: "Every project starts with how you live and work, ",
      muted:
        "then takes shape through layout, light and material until the space feels calm, balanced and entirely yours.",
    },
    /* Placeholder scope — confirm with the studio. */
    included: {
      title: "What’s Included",
      items: [
        {
          title: "Space Planning",
          description: "Layouts that make every square metre work, from circulation to storage.",
        },
        {
          title: "Concept & Mood",
          description: "A clear design direction with palettes, materials and references.",
        },
        {
          title: "3D Visualisation",
          description: "Photo-real renders so you can walk through the space before it is built.",
        },
        {
          title: "Technical Drawings",
          description: "Detailed plans, elevations and joinery drawings for the site team.",
        },
        {
          title: "Lighting Design",
          description: "Layered natural and artificial light that sets the mood of each room.",
        },
        {
          title: "Site Supervision",
          description: "Regular visits to keep quality and details on track until handover.",
        },
      ],
    },
    details: [
      image(
        "interior-detail-1",
        "Apartment living and dining area under timber beams with sea views",
        2400,
        1600,
      ),
      image(
        "interior-detail-2",
        "Grey clinic lounge with a monochrome artwork and linear lighting",
        1600,
        1920,
      ),
      image(
        "interior-detail-stair",
        "Villa reception with a travertine wall, a floating stair and an indoor olive tree",
        2000,
        1538,
      ),
      image(
        "interior-detail-cafe",
        "Café under a curved plaster ceiling with rattan seating and timber shelving",
        2000,
        1333,
      ),
    ],
    projects: related("Interior Design"),
  },
  {
    slug: "ffe",
    eyebrow: "Our services",
    title: "(FF&E) Solution",
    intro:
      "We deliver turnkey FF&E, from furniture and lighting selection to the final finishing touches.",
    hero: {
      // Full-resolution render (Palm Hills October, reception 6), framed on the sofa and table.
      ...image(
        "ffe-hero-2k",
        "Modular sofa with striped cushions around a round stone coffee table",
        2000,
        2222,
      ),
      focus: "50% 62%",
    },
    statement: {
      lead: "Furniture, fixtures and equipment complete a space, ",
      muted:
        "so we select, source and install every piece to fit the design, the budget and the way it will be used.",
    },
    /* Placeholder scope — confirm with the studio. */
    included: {
      title: "What’s Included",
      items: [
        {
          title: "Furniture Selection",
          description: "Pieces chosen for comfort, scale and character, ready-made or bespoke.",
        },
        {
          title: "Lighting & Fixtures",
          description: "Decorative and functional lighting, hardware and sanitary fittings.",
        },
        {
          title: "Soft Furnishings",
          description: "Curtains, rugs, cushions and upholstery in coordinated fabrics.",
        },
        {
          title: "Sourcing & Procurement",
          description: "Quotes, orders and supplier follow-up handled on your behalf.",
        },
        {
          title: "Styling & Accessories",
          description: "Art, objects and greenery that give the finished space its warmth.",
        },
        {
          title: "Delivery & Installation",
          description: "Coordinated delivery and on-site installation, ready to use.",
        },
      ],
    },
    details: [
      {
        ...image(
          "ffe-detail-living",
          "Living room with arched oak shelving, a ribbed leather sofa and a travertine table",
          1800,
          2000,
        ),
        // Frame the lower part of the portrait render: the travertine table, chairs and rug.
        focus: "50% 85%",
      },
      image(
        "ffe-detail-2",
        "Round oak dining table with curved chairs on a jute rug in afternoon light",
        1980,
        2200,
      ),
      image(
        "ffe-detail-open-plan",
        "Open-plan living and kitchen with a green armchair, leather daybed and striped rug",
        2000,
        1538,
      ),
      {
        ...image(
          "ffe-detail-lounge",
          "Calm lounge with a cream sofa, pale blue armchairs and a large abstract artwork",
          2000,
          1333,
        ),
        // Closer in on the sofa, armchairs and coffee table.
        focus: "50% 62%",
        zoom: 1.3,
      },
    ],
    projects: related("FF&E"),
  },
];

export const serviceSlugs = services.map((service) => service.slug);

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
