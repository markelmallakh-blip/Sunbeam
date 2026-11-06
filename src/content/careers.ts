/*
 * Careers: the list page (/careers) and one page per open role (/careers/[slug]). There is no
 * Figma frame for them yet; they reuse the inner-page patterns. Every role below is a placeholder
 * for the studio to confirm or replace.
 */

export type Role = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const careersPage = {
  eyebrow: "Careers",
  title: "Join Sunbeam",
  intro:
    "We are a small team of architects and interior designers who care about light, material and detail. If that sounds like you, we would love to hear from you.",
  hero: {
    src: "/images/careers/careers-hero.webp",
    alt: "A designer laying out fabric, stone and paint samples on a table",
  },
  browseRoles: "View open roles",
  /* The hanging studio badge in the hero (React Bits Lanyard); drag it, click to flip. */
  badge: {
    front: "/images/careers/lanyard-front.svg",
    back: "/images/careers/lanyard-back.svg",
    strap: "/images/careers/lanyard-strap.svg",
  },
  /*
   * Large statement with studio photos set between its words. `{0}`, `{1}`, `{2}` mark where each
   * photo sits.
   */
  statement: {
    text: "We are a small team {0} of architects and interior designers who care about light, {1} material and detail. If that sounds like you, {2} we would love to hear from you.",
    /* Close-up crops (2.2:1), sized for the pills. */
    photos: [
      { src: "/images/careers/pill-smile.webp", alt: "A smiling designer at the studio" },
      { src: "/images/careers/pill-office.webp", alt: "The Sunbeam studio office" },
      { src: "/images/careers/pill-drawing.webp", alt: "A hand marking up construction drawings" },
    ],
  },
  why: {
    eyebrow: "Life at the studio",
    title: "Why Work at Sunbeam Studio",
    intro:
      "A small, close team where good ideas travel fast and every project gets the care it deserves.",
    /* Placeholder descriptions — confirm with the studio. Icons from Figma 209:2437; an empty
     `icon` shows a blank tile. */
    reasons: [
      {
        title: "Meaningful Projects",
        icon: "/images/careers/icon-meaningful-projects.webp",
        description:
          "Homes, clinics, cafés, clubhouses and new buildings, followed from the first sketch to handover.",
      },
      {
        title: "A Room to Grow",
        icon: "/images/careers/icon-room-to-grow.webp",
        description:
          "Mentoring from senior designers, real ownership of your work and a clear path to lead projects.",
      },
      {
        title: "Learn Across Disciplines",
        icon: "/images/careers/icon-learn-across-disciplines.webp",
        description:
          "Work side by side with architects, interior designers and FF&E specialists, and see how a whole space comes together.",
      },
      {
        title: "Care in Every Detail",
        icon: "/images/careers/icon-care-in-every-detail.webp",
        description:
          "A studio that takes the time to get things right, where every idea gets a fair hearing and knowledge is shared freely.",
      },
    ],
  },
  rolesTitle: "Open Roles",
  applyNow: "Apply Now",
  otherRolesTitle: "Other Open Roles",
};

/** Shared by every role until the studio supplies its own list. */
export const roleOffer = [
  "A competitive salary reviewed every year",
  "Medical insurance after probation",
  "Flexible hours and hybrid days",
  "Budget for courses, books and software",
];

export const roles: Role[] = [
  {
    slug: "senior-interior-designer",
    title: "Senior Interior Designer",
    department: "Interior Design",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "5+ years",
    summary:
      "Lead residential and commercial interiors from concept to site, guiding a small team and presenting directly to clients.",
    responsibilities: [
      "Lead projects from brief and concept through detailed design and handover",
      "Present concepts, mood boards and material palettes to clients",
      "Guide junior designers and review drawings before they leave the studio",
      "Coordinate with contractors, suppliers and the FF&E team on site",
    ],
    requirements: [
      "A degree in interior design or architecture",
      "At least five years of studio experience, including residential work",
      "Fluent in AutoCAD and SketchUp or 3ds Max",
      "A portfolio that shows built work and strong detailing",
    ],
  },
  {
    slug: "architect",
    title: "Architect",
    department: "Architecture",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "3+ years",
    summary:
      "Shape facades, massing and landscape for villas and clubhouses, working closely with the interiors team.",
    responsibilities: [
      "Develop concept and schematic designs for new buildings and extensions",
      "Prepare permit and construction drawing sets",
      "Coordinate structural and MEP consultants",
      "Visit sites to keep the build true to the design",
    ],
    requirements: [
      "A degree in architecture",
      "Three or more years in practice",
      "Confident in Revit or ArchiCAD, and AutoCAD",
      "Knowledge of local building codes and approvals",
    ],
  },
  {
    slug: "ffe-coordinator",
    title: "FF&E Coordinator",
    department: "FF&E",
    location: "Cairo, Egypt",
    type: "Full-time",
    experience: "2+ years",
    summary:
      "Source, order and track furniture, lighting and finishes so every piece arrives on time and as specified.",
    responsibilities: [
      "Build FF&E schedules from the design drawings",
      "Request quotes, place orders and follow up with suppliers",
      "Track budgets, lead times and deliveries",
      "Oversee installation and snagging on site",
    ],
    requirements: [
      "Experience in procurement, purchasing or FF&E",
      "Organised, with strong Excel skills",
      "A good eye for materials and finishes",
      "Clear communication in Arabic and English",
    ],
  },
  {
    slug: "3d-visualiser",
    title: "3D Visualiser",
    department: "Visualisation",
    location: "Cairo, Egypt · Hybrid",
    type: "Full-time",
    experience: "2+ years",
    summary:
      "Turn our designs into calm, photo-real renders and short films that clients can walk through before anything is built.",
    responsibilities: [
      "Model and render interiors and exteriors from design drawings",
      "Set lighting, materials and cameras that match the studio’s style",
      "Produce stills and short animations for presentations",
      "Keep a tidy library of models and materials",
    ],
    requirements: [
      "Strong in 3ds Max with Corona or V-Ray",
      "A portfolio of interior renders with natural light",
      "Photoshop for post-production",
      "Unreal or D5 is a plus",
    ],
  },
];

export const roleSlugs = roles.map((role) => role.slug);

export const getRole = (slug: string) => roles.find((role) => role.slug === slug);

export const roleHref = (slug: string) => `/careers/${slug}`;
