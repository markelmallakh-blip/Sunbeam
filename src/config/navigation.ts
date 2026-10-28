import { withBase } from "@/lib/base-path";

export type MenuKey = "services" | "projects";

export type NavItem = {
  label: string;
  href: string;
  /** Opens that header dropdown (Figma "Services menu" / "Projects menu"). */
  menu?: MenuKey;
};

export type FooterColumn = {
  title: string;
  links: readonly NavItem[];
};

export const mainNavigation: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services/interior-design", menu: "services" },
  { label: "Projects", href: "/projects", menu: "projects" },
  { label: "FAQs", href: "/faqs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export const primaryCta: NavItem = { label: "Schedule Meeting", href: "/contact" };

/* Figma "Services menu" (116:6904): one photo card per service. */
export const servicesMenu = [
  {
    title: "Interior Design",
    description:
      "We create thoughtful spaces through smart planning, creative concepts, and designs tailored to your needs.",
    href: "/services/interior-design",
    image: withBase("/images/home-v2/service-interior.webp"),
    alt: "Open-plan dining and living room with pendant lights and timber finishes",
  },
  {
    title: "(FF&E) Solution",
    description:
      "We deliver turnkey FF&E, from furniture and lighting selection to the final finishing touches.",
    href: "/services/ffe",
    image: withBase("/images/home-v2/service-ffe-2k.webp"),
    /* Frames the sofa and the round stone table. */
    focus: "50% 62%",
    alt: "Modular sofa with striped cushions around a round stone coffee table",
  },
] as const;

/*
 * Figma "Projects menu" (116:6109): a photo and project list per sector. Projects without a page
 * yet link to the projects list. `position` reproduces each photo's crop in the Figma frame.
 */
export const projectsMenu = {
  cta: { label: "View all projects", href: "/projects" },
  columns: [
    {
      title: "Residential",
      image: withBase("/images/menus/residential.webp"),
      position: "50% 50%",
      links: [
        { label: "Sodic Villette", href: "/projects/sodic-villette" },
        { label: "Kalethia Greece", href: "/projects/kalethia" },
        { label: "Palm Hills October", href: "/projects" },
        { label: "Almaza Bay Villa", href: "/projects/almaza-bay" },
        { label: "Playa Chalet", href: "/projects" },
      ],
    },
    {
      title: "Food & Beverage",
      image: withBase("/images/menus/food.webp"),
      position: "50% 50%",
      links: [
        { label: "Baxters Restaurant", href: "/projects/baxters" },
        { label: "Pottery Cafe", href: "/projects" },
        { label: "Wonderville Patisserie", href: "/projects" },
      ],
    },
    {
      title: "Gym & Clubhouse",
      image: withBase("/images/menus/gym.webp"),
      position: "50% 50%",
      links: [
        { label: "LA7 Zoya Clubhouse", href: "/projects/la7-zoya" },
        { label: "Brass Monkeys Clubhouse", href: "/projects" },
      ],
    },
    {
      title: "Clinics",
      image: withBase("/images/menus/clinics.webp"),
      position: "50% 62%",
      links: [{ label: "FAMM Dental Clinic", href: "/projects/famm-dental" }],
    },
    {
      title: "Administrative & Retail",
      image: withBase("/images/menus/office.webp"),
      position: "50% 43%",
      links: [
        { label: "Aspect Working Space", href: "/projects" },
        { label: "Mother Naked & Humanity Code", href: "/projects" },
      ],
    },
  ],
} as const;

export const footerNavigation: readonly FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Interior Design", href: "/services/interior-design" },
      { label: "(FF&E) Solution", href: "/services/ffe" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "Residential", href: "/projects" },
      { label: "Commercial", href: "/projects" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
];

export const legalNavigation: readonly NavItem[] = [
  { label: "Terms & Conditions", href: "/#footer" },
  { label: "Privacy Policy", href: "/#footer" },
];
