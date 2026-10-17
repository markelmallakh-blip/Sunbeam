import type { ImageAsset } from "@/types/media";
import { withBase } from "@/lib/base-path";
import { projects, testimonials, type Project } from "./home";
import { projectRenders, type RenderFile } from "./project-renders";

/*
 * Project detail pages (Figma "Single Project — Baxters", 60:803). The listing (title, tags,
 * cover) lives in home.ts; this adds the case-study content per slug. A project gets its own
 * page as soon as it has an entry here.
 */

const image = (src: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src,
  alt,
  width,
  height,
});

const render = (file: string, alt: string, width = 1600, height = 1920) =>
  image(withBase(`/images/projects/baxters/${file}.webp`), alt, width, height);

export type ProjectDetail = {
  slug: string;
  /** Tags shown on the hero card (the listing's tags plus the service). */
  tags: string[];
  summary: string;
  /** Client logo on the hero card (optional). */
  logo?: ImageAsset;
  hero: ImageAsset;
  /** Shown as the hero card opens up on scroll (Figma "expanded" variant, 70:4049). */
  brief: {
    title: string;
    text: string;
    images: [ImageAsset, ImageAsset];
    stats?: { value: number; prefix?: string; suffix?: string; pad?: number; label: string }[];
  };
  /** Photos, statement and the "Our Art in Detail" bento (hand-made case studies only). */
  overview?: {
    images: [ImageAsset, ImageAsset];
    statement: string;
    detailTitle: string;
    /** Material palette, as swatch colours. */
    palette: { name: string; hex: string }[];
    /** Product cut-outs (the pendant and table are white-background shots, multiplied into their tiles). */
    pieces: {
      oak: ImageAsset;
      planter: ImageAsset;
      pendant: ImageAsset;
      table: ImageAsset;
      sage: ImageAsset;
    };
  };
  deliver: { title: string; items: { title: string; text: string; image: ImageAsset }[] };
  gallery: { eyebrow: string; title: string; images: ImageAsset[] };
  feedback?: { image: ImageAsset; quote: string; name: string; project: string };
};

const fallbackTestimonial = testimonials.items[0];

const details: ProjectDetail[] = [
  {
    slug: "baxters",
    tags: ["Commercial", "Food & Beverage", "FF&E"],
    summary:
      "A neighbourhood bakery-café where warm timber beams, graphic monochrome floors and soft pendant light create an easy, all-day atmosphere — designed to feel as good at 8am coffee as it does at a long weekend lunch.",
    logo: image(
      withBase("/images/projects/baxters/logo.webp"),
      "Bäxters European Kitchen",
      360,
      274,
    ),
    hero: render(
      "hero",
      "Baxters dining hall under timber beams, with tables on a monochrome tiled floor and the bäxters window beyond",
    ),
    brief: {
      title: "Project Overview",
      text: "Baxters wanted a European-style bakery and kitchen that works from early breakfast to late dinner — open, bright and welcoming, with the bakery counter at the heart of the space.",
      images: [
        render(
          "brief-terrace",
          "Baxters terrace with umbrellas, planters and café tables between the buildings",
          1400,
          1680,
        ),
        render(
          "brief-table",
          "Baxters timber communal table beside a plaster column with a wall-arm lamp",
          1400,
          1680,
        ),
      ],
      stats: [
        { value: 200, label: "Square Meters" },
        { value: 6, pad: 2, label: "Weeks" },
        { value: 50, prefix: "+", label: "Units Delivered" },
      ],
    },
    overview: {
      images: [
        render(
          "overview-interior",
          "Baxters bakery counter and seating beneath exposed timber beams and black pendant lights",
        ),
        render(
          "overview-exterior",
          "Baxters street frontage with outdoor seating, umbrellas and planters",
          1400,
          1680,
        ),
      ],
      statement: "A bakery that feels like the neighbourhood’s living room.",
      detailTitle: "Our Art in Detail",
      palette: [
        { name: "Walnut", hex: "#735438" },
        { name: "Charcoal", hex: "#262626" },
        { name: "Linen", hex: "#E5E0D6" },
        { name: "Sage", hex: "#99B299" },
        { name: "Brass", hex: "#B89961" },
      ],
      pieces: {
        oak: render("chair-oak", "Oak-veneer café chair with black steel legs", 800, 926),
        planter: render("planter", "Fluted concrete planter with mixed greenery", 329, 300),
        pendant: render("pendant", "Black enamel dome pendant light", 800, 926),
        table: render(
          "table",
          "Timber communal table against a plaster column with a wall-arm lamp",
          900,
          822,
        ),
        sage: render("chair-sage", "Sage-green café chair", 800, 926),
      },
    },
    deliver: {
      title: "What We Deliver",
      items: [
        {
          title: "Interior Design",
          text: "We shaped Baxters through thoughtful space planning, a warm design concept, and a careful mix of natural materials, lighting, and furniture to create a welcoming European-inspired bakery and restaurant.",
          image: render(
            "deliver-design",
            "The bäxters logo wall with blue plate details, pendant lights and café tables",
          ),
        },
        {
          title: "Furniture, Fixtures & Equipment (FF&E)",
          text: "We brought the space together with a turnkey FF&E approach, coordinating furniture, lighting, fixtures, finishes, and decorative details to create a cohesive look and a comfortable, inviting atmosphere.",
          image: render(
            "deliver-ffe",
            "Baxters seating with timber counters, sage chairs and black pendant lights",
          ),
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Design Details",
      images: [
        render("gallery-01", "Baxters dining hall seen from the entrance", 1000, 1200),
        render("gallery-02", "Baxters tables facing the bakery window", 1000, 1200),
        render("gallery-03", "Baxters pastry counter and service area", 1000, 1200),
        render("gallery-04", "Baxters counter with pendant lights", 1000, 1200),
        render("gallery-05", "Baxters window seating with timber tables", 1000, 1200),
        render("gallery-06", "Baxters bakery display shelving", 1000, 1200),
        render("gallery-07", "Baxters shopfront with black signage", 1000, 1200),
        render("gallery-08", "Baxters terrace among planters", 1000, 1200),
      ],
    },
    feedback: {
      image: render("deliver-ffe", ""),
      /* Figma reuses the homepage testimonial here until the Baxters client quote is supplied. */
      quote: fallbackTestimonial?.quote ?? "",
      name: fallbackTestimonial?.author ?? "",
      project: fallbackTestimonial?.project ?? "",
    },
  },
];

/*
 * Projects without a hand-made case study get a page built from their renders
 * (scripts/project-renders.mjs). The copy is a neutral placeholder until each project's own
 * story, client quote and numbers are supplied.
 */
const fromRenders = (project: Project): ProjectDetail | undefined => {
  const renders = projectRenders[project.slug];
  if (!renders) return undefined;
  const photo = (file: RenderFile | undefined, alt: string) =>
    file ? image(withBase(file.src), alt, file.width, file.height) : project.cover;
  const kind = project.tags.join(" · ").toLowerCase();
  return {
    slug: project.slug,
    tags: [...project.tags, "FF&E"],
    summary: `${project.title} is a ${kind} project by Sunbeam Design Studio — shaped from first concept and space planning through to the final furniture, lighting and styling.`,
    hero: project.cover,
    brief: {
      title: "Project Overview",
      text: "A calm, considered space built around how it is used every day, with natural materials, soft light and carefully chosen furniture bringing it together.",
      images: [
        photo(renders.brief[0], `${project.title} interior`),
        photo(renders.brief[1], `${project.title} interior detail`),
      ],
    },
    deliver: {
      title: "What We Deliver",
      items: [
        {
          title: "Interior Design",
          text: "Thoughtful space planning, a clear design concept and a careful mix of materials, lighting and furniture, shaped around the people who use the space.",
          image: photo(renders.deliver[0], `${project.title} interior design`),
        },
        {
          title: "Furniture, Fixtures & Equipment (FF&E)",
          text: "A turnkey FF&E approach — furniture, lighting, fixtures, finishes and decorative details coordinated into one cohesive, comfortable whole.",
          image: photo(renders.deliver[1], `${project.title} furniture and fixtures`),
        },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Design Details",
      images: renders.gallery.map((file, index) =>
        photo(file, `${project.title} — view ${index + 1}`),
      ),
    },
  };
};

const generated = projects.items
  .filter((project) => !details.some((detail) => detail.slug === project.slug))
  .map(fromRenders)
  .filter((detail): detail is ProjectDetail => Boolean(detail));

const allDetails = [...details, ...generated];

export function getProjectDetail(slug: string) {
  return allDetails.find((detail) => detail.slug === slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.items.find((project) => project.slug === slug);
}

export const projectSlugs = allDetails.map((detail) => detail.slug);

/** Detail page when one exists, otherwise the homepage projects section. */
export function projectHref(slug: string) {
  return projectSlugs.includes(slug) ? `/projects/${slug}` : "/#projects";
}
