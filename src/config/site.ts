import { withBase } from "@/lib/base-path";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Sunbeam Spaces",
  legalName: "Sunbeam Design Studio",
  title: "Sunbeam Spaces — Residential & Commercial Interiors in Egypt",
  description:
    "Sunbeam Design Studio creates residential and commercial interiors in Egypt that blend style, comfort and function through thoughtful design, space planning and FF&E.",
  url: siteUrl,
  locale: "en_US",
  ogImage: withBase("/og/home.jpg"),
  contact: {
    email: "hello@sunbeam.com",
    address: "7 El-Marwa, Nabil Al Wakkad, Cairo, Egypt",
    /* "Get Directions" in the footer: a Maps search for the address until the studio's pin is shared. */
    directions:
      "https://www.google.com/maps/search/?api=1&query=7%20El-Marwa%2C%20Nabil%20Al%20Wakkad%2C%20Cairo%2C%20Egypt",
  },
  /*
   * Cal.com event used by "Schedule Meeting" and the consultation section, as "user/event".
   * Until it is set, the consultation section shows the built-in booking card instead.
   */
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
  social: [
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/sunbeamspaces" },
    { network: "instagram", label: "Instagram", href: "https://www.instagram.com/sunbeam_spaces" },
    /* Placeholder profile links — confirm with the studio. */
    {
      network: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/sunbeamspaces",
    },
    { network: "behance", label: "Behance", href: "https://www.behance.net/sunbeamspaces" },
  ],
} as const;
