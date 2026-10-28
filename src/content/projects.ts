import type { ImageAsset } from "@/types/media";
import { withBase } from "@/lib/base-path";

/*
 * Projects: the list page (Figma "Projects" 185:1587) and each case study (Figma "Single Project
 * — Baxters" 90:3139). Baxters carries the real case-study content from Figma; the other five use
 * their homepage card data and are marked `placeholder` until their copy and renders arrive.
 */

type Size = [number, number];

const asset = (slug: string, file: string, alt: string, [width, height]: Size): ImageAsset => ({
  type: "image",
  src: withBase(`/images/projects-v2/${slug}/${file}.webp`),
  alt,
  width,
  height,
});

/**
 * A gallery photo. `wide` is an optional 16:9 crop of the same render that the full-screen viewer
 * shows instead, so wide shots read as landscape there while the grid keeps its own crops.
 */
export type GalleryImage = ImageAsset & { wide?: ImageAsset };

/**
 * Gallery files gallery-01 … gallery-NN with their sizes, all described by one alt line. Numbers
 * listed in `wide` also have a gallery-NN-wide file (1600 × 900).
 */
const gallery = (slug: string, alt: string, sizes: Size[], wide: number[] = []) =>
  sizes.map((size, index): GalleryImage => {
    const file = `gallery-${String(index + 1).padStart(2, "0")}`;
    const label = `${alt} — view ${index + 1}`;
    const image = asset(slug, file, label, size);
    return wide.includes(index + 1)
      ? { ...image, wide: asset(slug, `${file}-wide`, label, [1600, 900]) }
      : image;
  });

export type ProjectCategory = "Residential" | "Commercial";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** Service line shown in the card and hero meta, e.g. "FF&E" or "Interior Design". */
  services: string[];
  location: string;
  year: string;
  /** Extra hero tag between category and services (e.g. "Food & Beverage"). */
  sector?: string;
  summary: string;
  cover: ImageAsset;
  hero: ImageAsset;
  logo?: ImageAsset;
  /** "Our Art in Detail": material palette and selected pieces (hand-made case studies only). */
  detail?: {
    title: string;
    text: string;
    palette: string[];
    pieces: ImageAsset[];
  };
  gallery: GalleryImage[];
  /** Copy and imagery still to be supplied by the studio. */
  placeholder?: boolean;
};

const PLACEHOLDER_SUMMARY =
  "Placeholder — the case-study description for this project will be added once the studio supplies its copy.";

const baxtersGallery: Size[] = [
  [1400, 1680],
  [1400, 1680],
  [1400, 1680],
  [1200, 1440],
  [1200, 1440],
  [1200, 1440],
  ...Array.from({ length: 8 }, (): Size => [1000, 1200]),
  ...Array.from({ length: 6 }, (): Size => [1200, 1440]),
];

export const projects: Project[] = [
  {
    slug: "sodic-villette",
    title: "Sodic Villette",
    category: "Residential",
    services: ["FF&E"],
    location: "New Cairo",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "sodic-villette",
      "cover",
      "Sodic Villette living room with a green lounge chair and a sculpted coffee table",
      [1200, 923],
    ),
    hero: asset(
      "sodic-villette",
      "cover",
      "Sodic Villette living room with a green lounge chair and a sculpted coffee table",
      [1200, 923],
    ),
    gallery: gallery("sodic-villette", "Sodic Villette interiors", [
      [1200, 923],
      [1200, 923],
      [1200, 923],
      [1200, 923],
      [1000, 1111],
      [1000, 563],
      [1000, 563],
      [1000, 1200],
      [1000, 769],
      [1000, 769],
      [1000, 769],
      [1000, 769],
    ]),
    placeholder: true,
  },
  {
    slug: "baxters",
    title: "Baxters Restaurant",
    category: "Commercial",
    sector: "Food & Beverage",
    services: ["FF&E"],
    location: "Egypt",
    year: "2025",
    summary:
      "A neighbourhood bakery-café where warm timber beams, graphic monochrome floors and soft pendant light create an easy, all-day atmosphere — designed to feel as good at 8am coffee as it does at a long weekend lunch.",
    cover: asset(
      "baxters",
      "cover",
      "Baxters restaurant with timber beams, pendant lights and a monochrome tiled floor",
      [1200, 1440],
    ),
    hero: asset(
      "baxters",
      "hero",
      "Baxters dining hall under timber beams, with the bäxters window and the bakery counter",
      [1600, 1920],
    ),
    logo: asset("baxters", "logo-mark", "Bäxters European Kitchen", [360, 274]),
    detail: {
      title: "Our Art in Detail",
      text: "Explore the colors, textures, and carefully selected pieces that bring our design vision to life, creating spaces with character and timeless appeal.",
      palette: ["#262626", "#e5e0d6", "#735438", "#99b299", "#b89961"],
      pieces: [
        asset("baxters", "piece-oak", "Oak café chair with black steel legs", [700, 810]),
        asset("baxters", "piece-planter", "Fluted concrete planter with shrubs", [800, 730]),
        asset("baxters", "piece-pendant", "Black enamel pendant lamp", [800, 926]),
        asset("baxters", "piece-sage", "Sage green café chair", [800, 926]),
        asset("baxters", "piece-table", "Timber communal table with a wall lamp", [800, 731]),
      ],
    },
    gallery: (() => {
      // Figma order: exterior, counter, dining hall, terrace, table from above, bakery shelves.
      const [g1, g2, g3, g4, g5, g6, ...rest] = gallery(
        "baxters",
        "Baxters restaurant",
        baxtersGallery,
        // Halls and counters that read best wide; the rest stay portrait in the viewer.
        [3, 6, 7, 8, 10, 12, 15, 16, 20],
      );
      return [g1, g3, g6, g4, g5, g2, ...rest].filter((image): image is GalleryImage =>
        Boolean(image),
      );
    })(),
  },
  {
    slug: "la7-zoya",
    title: "LA7 Zoya Clubhouse",
    category: "Commercial",
    services: ["Interior Design"],
    location: "North Coast",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "la7-zoya",
      "cover",
      "LA7 Zoya clubhouse gym under a timber ceiling with exposed ducts",
      [1145, 1374],
    ),
    hero: asset(
      "la7-zoya",
      "cover",
      "LA7 Zoya clubhouse gym under a timber ceiling with exposed ducts",
      [1145, 1374],
    ),
    gallery: gallery("la7-zoya", "LA7 Zoya clubhouse", [
      [1200, 675],
      [1200, 1440],
      [1200, 675],
      [1200, 1440],
      [1000, 1200],
      [1000, 1111],
      [1000, 667],
      [1000, 667],
      [1000, 1111],
      [1000, 1111],
      [1000, 1111],
      [1000, 1111],
    ]),
    placeholder: true,
  },
  {
    slug: "almaza-bay",
    title: "Almaza Bay Villa",
    category: "Residential",
    services: ["FF&E"],
    location: "Almaza Bay",
    year: "2024",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "almaza-bay",
      "cover",
      "Almaza Bay villa living room opening onto a sea view",
      [1200, 800],
    ),
    hero: asset(
      "almaza-bay",
      "cover",
      "Almaza Bay villa living room opening onto a sea view",
      [1200, 800],
    ),
    gallery: [],
    placeholder: true,
  },
  {
    slug: "famm-dental",
    title: "FAMM Dental Clinic",
    category: "Commercial",
    services: ["Interior Design"],
    location: "El Sheikh Zayed",
    year: "2024",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "famm-dental",
      "cover",
      "FAMM dental clinic waiting area with a blue door and framed prints",
      [1200, 1440],
    ),
    hero: asset(
      "famm-dental",
      "cover",
      "FAMM dental clinic waiting area with a blue door and framed prints",
      [1200, 1440],
    ),
    gallery: [],
    placeholder: true,
  },
  {
    slug: "kalethia",
    title: "Kalethia Apartment",
    category: "Residential",
    services: ["Interior Design"],
    location: "Greece",
    year: "2023",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "kalethia",
      "cover",
      "Kalethia apartment dining nook with a round timber table on a woven rug",
      [1200, 1333],
    ),
    hero: asset(
      "kalethia",
      "cover",
      "Kalethia apartment dining nook with a round timber table on a woven rug",
      [1200, 1333],
    ),
    gallery: [],
    placeholder: true,
  },
  // Added from the studio's render folders; services, locations and years are placeholders.
  {
    slug: "aspect-offices",
    title: "Aspect Offices",
    category: "Commercial",
    services: ["Interior Design"],
    location: "Egypt",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "aspect-offices",
      "cover",
      "Aspect office corridor with timber slats and glass partitions",
      [1145, 1374],
    ),
    hero: asset(
      "aspect-offices",
      "cover",
      "Aspect office corridor with timber slats and glass partitions",
      [1145, 1374],
    ),
    gallery: gallery("aspect-offices", "Aspect offices", [
      [1200, 1333],
      [1200, 800],
      [1200, 1333],
      [1200, 1333],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
    ]),
    placeholder: true,
  },
  {
    slug: "dental-clinic",
    title: "Dental Clinic",
    category: "Commercial",
    services: ["Interior Design"],
    location: "Egypt",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "dental-clinic",
      "cover",
      "Dental clinic office with a dark desk, garden windows and sculptural art",
      [1145, 1374],
    ),
    hero: asset(
      "dental-clinic",
      "cover",
      "Dental clinic office with a dark desk, garden windows and sculptural art",
      [1145, 1374],
    ),
    gallery: gallery("dental-clinic", "Dental clinic", [
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
      [1200, 1440],
    ]),
    placeholder: true,
  },
  {
    slug: "pottery-cafe",
    title: "Pottery Café",
    category: "Commercial",
    services: ["Interior Design"],
    location: "Egypt",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "pottery-cafe",
      "cover",
      "Pottery café with a curved plaster ceiling and rattan seating",
      [1145, 1374],
    ),
    hero: asset(
      "pottery-cafe",
      "cover",
      "Pottery café with a curved plaster ceiling and rattan seating",
      [1145, 1374],
    ),
    gallery: gallery("pottery-cafe", "Pottery café", [
      [1200, 800],
      [1200, 800],
      [1200, 1333],
      [1200, 800],
      [1200, 1333],
      [1200, 800],
      [1200, 800],
      [1200, 800],
      [1200, 1333],
      [1200, 1333],
      [1200, 1333],
      [1200, 800],
    ]),
    placeholder: true,
  },
  {
    slug: "wndr",
    title: "Wonderville",
    category: "Commercial",
    services: ["Interior Design"],
    location: "Egypt",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "wndr",
      "cover",
      "Wonderville dessert counter under a sculpted ribbon ceiling",
      [1145, 1374],
    ),
    hero: asset(
      "wndr",
      "cover",
      "Wonderville dessert counter under a sculpted ribbon ceiling",
      [1145, 1374],
    ),
    gallery: gallery("wndr", "Wonderville", [
      [1200, 800],
      [1200, 1412],
      [1200, 800],
      [1200, 1411],
      [1200, 800],
      [1200, 1411],
      [1200, 1412],
      [1200, 800],
    ]),
    placeholder: true,
  },
  {
    slug: "brass-monkeys",
    title: "Brass Monkeys Gym",
    category: "Commercial",
    services: ["Interior Design"],
    location: "Egypt",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "brass-monkeys",
      "cover",
      "Brass Monkeys gym lounge beneath a graffiti-covered column",
      [1145, 1374],
    ),
    hero: asset(
      "brass-monkeys",
      "cover",
      "Brass Monkeys gym lounge beneath a graffiti-covered column",
      [1145, 1374],
    ),
    gallery: gallery("brass-monkeys", "Brass Monkeys gym", [
      [1200, 1412],
      [1200, 1412],
      [1200, 675],
      [1200, 1440],
      [1200, 1440],
      [1200, 800],
      [1200, 800],
      [1200, 800],
      [1200, 1440],
      [1200, 1440],
      [1200, 800],
      [1200, 800],
    ]),
    placeholder: true,
  },
  {
    slug: "playa",
    title: "Playa Chalet",
    category: "Residential",
    services: ["Interior Design"],
    location: "North Coast",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "playa",
      "cover",
      "Playa chalet living room with a stone coffee table and a calm plaster wall",
      [1145, 1374],
    ),
    hero: asset(
      "playa",
      "cover",
      "Playa chalet living room with a stone coffee table and a calm plaster wall",
      [1145, 1374],
    ),
    gallery: gallery("playa", "Playa chalet", [
      [1200, 800],
      [1200, 800],
      [1200, 1333],
      [1200, 1333],
      [1200, 800],
      [1200, 800],
      [1200, 800],
      [1200, 1333],
      [1200, 800],
      [1200, 1333],
      [1200, 1333],
      [1200, 1333],
    ]),
    placeholder: true,
  },
  {
    slug: "palm-hills-october",
    title: "Palm Hills Villa",
    category: "Residential",
    services: ["Interior Design"],
    location: "6th of October",
    year: "2025",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "palm-hills-october",
      "cover",
      "Palm Hills villa stair with an indoor olive tree and travertine walls",
      [1145, 1374],
    ),
    hero: asset(
      "palm-hills-october",
      "cover",
      "Palm Hills villa stair with an indoor olive tree and travertine walls",
      [1145, 1374],
    ),
    gallery: gallery("palm-hills-october", "Palm Hills villa", [
      [1200, 923],
      [1200, 1333],
      [1200, 1333],
      [1200, 1333],
      [1200, 1333],
      [1200, 923],
      [1200, 1333],
      [1200, 923],
      [1200, 1333],
      [1200, 923],
      [1200, 1333],
      [1200, 1333],
    ]),
    placeholder: true,
  },
  {
    slug: "swanlake",
    title: "Swanlake Concept Store",
    category: "Commercial",
    services: ["Interior Design"],
    location: "Egypt",
    year: "2026",
    summary: PLACEHOLDER_SUMMARY,
    cover: asset(
      "swanlake",
      "cover",
      "Swanlake beach concept store, a pink-and-timber pavilion among palm trees",
      [1145, 1374],
    ),
    hero: asset(
      "swanlake",
      "cover",
      "Swanlake beach concept store, a pink-and-timber pavilion among palm trees",
      [1145, 1374],
    ),
    gallery: gallery("swanlake", "Swanlake concept store", [
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
      [1151, 1380],
    ]),
    placeholder: true,
  },
];

export const projectSlugs = projects.map((project) => project.slug);

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

export const projectHref = (slug: string) => `/projects/${slug}`;

/** Card meta line: category, services, location (Figma Project Card "Tags"). */
export const projectTags = (project: Project) => [
  project.category,
  ...project.services,
  project.location,
];

export const projectsPage = {
  eyebrow: "Our Work",
  title: "Spaces We’ve Shaped",
  description:
    "A selection of homes, workplaces and hospitality interiors across Egypt and beyond — each one shaped by light, material and the way people truly live.",
  /* Tabs filter on category or service; tabs without a matching project are left out. */
  filters: ["All", "Residential", "Commercial", "Hospitality", "FF&E"],
  pageSize: 9,
  loading: "Loading more projects",
};

export const projectDetailCopy = {
  galleryEyebrow: "Gallery",
  galleryTitle: "Design Details",
  showMore: "Show more",
  showLess: "Show less",
  discoverTitle: "Discover More",
  discoverCta: { label: "View all", href: "/projects" },
};
