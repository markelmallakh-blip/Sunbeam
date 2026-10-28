/* Contact page copy. Studio details themselves live in siteConfig.contact. */

export const projectTypes = ["Residential", "Commercial"] as const;
export type ProjectType = (typeof projectTypes)[number];

/* Asked when the project is commercial. */
export const businessFields = [
  "Food & Beverage",
  "Hospitality",
  "Office & Workspace",
  "Clinic & Healthcare",
  "Retail",
  "Gym & Wellness",
  "Other",
] as const;

/* Asked when the project is residential. */
export const unitTypes = [
  "Apartment",
  "Duplex / Penthouse",
  "Villa",
  "Townhouse",
  "Chalet",
  "Other",
] as const;

export const serviceNeeds = ["Interior Design", "FF&E", "Can't decide yet"] as const;
export type ServiceNeed = (typeof serviceNeeds)[number];

/* Country calling codes for the phone field; Egypt first as the default. */
export const countryCodes = [
  { code: "+20", country: "Egypt" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+974", country: "Qatar" },
  { code: "+965", country: "Kuwait" },
  { code: "+973", country: "Bahrain" },
  { code: "+968", country: "Oman" },
  { code: "+962", country: "Jordan" },
  { code: "+961", country: "Lebanon" },
  { code: "+30", country: "Greece" },
  { code: "+44", country: "United Kingdom" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+1", country: "United States / Canada" },
] as const;

export const contactPage = {
  eyebrow: "Contact us",
  title: "Let’s Talk About Your Space",
  intro:
    "Have a project in mind? Send us your inquiry and we’ll get back to you within two working days, or book a consultation call below.",
  details: {
    title: "Our Contacts",
    /* Placeholder — confirm the studio's working hours. */
    hours: "Sunday – Thursday, 10:00am – 6:30pm",
  },
  form: { title: "Send Us a Message" },
  booking: {
    eyebrow: "Schedule consultation call",
    title: "Prefer to Talk It Through?",
    description: "Pick a time for a relaxed 30-minute call about your space, goals and budget.",
  },
};
