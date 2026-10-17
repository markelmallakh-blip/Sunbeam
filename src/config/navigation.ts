export type NavItem = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: readonly NavItem[];
};

/* Pages not built yet point at their homepage sections; switch each link as its page lands. */
export const mainNavigation: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Blog", href: "/#newsletter" },
];

export const primaryCta: NavItem = { label: "Let's talk", href: "/#consultation" };

export const footerNavigation: readonly FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/#newsletter" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Interior Design", href: "/#services" },
      { label: "(FF&E) Solution", href: "/#services" },
    ],
  },
  {
    title: "Projects",
    links: [
      { label: "Residential", href: "/#projects" },
      { label: "Commercial", href: "/#projects" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", href: "/#consultation" },
      { label: "FAQs", href: "/#faqs" },
      { label: "Our work", href: "/#projects" },
    ],
  },
];

export const legalNavigation: readonly NavItem[] = [
  { label: "Terms & Conditions", href: "/#footer" },
  { label: "Privacy Policy", href: "/#footer" },
];
