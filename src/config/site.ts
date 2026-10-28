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
  },
  /*
   * Cal.com event used by "Schedule Meeting" and the consultation section, as "user/event".
   * Until it is set, the consultation section shows the built-in booking card instead.
   */
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
  social: [
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/sunbeamspaces" },
    { network: "instagram", label: "Instagram", href: "https://www.instagram.com/sunbeam_spaces" },
  ],
} as const;
