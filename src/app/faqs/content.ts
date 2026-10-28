import { faqs, type Faq } from "@/content/homepage";

export type FaqGroup = { title: string; items: Faq[] };

/*
 * FAQ page groups. The first two groups reuse the homepage questions (Figma copy); the
 * "Working together" answers are placeholders for the studio to confirm.
 */
export const faqPage = {
  eyebrow: "Support",
  title: faqs.title,
  intro:
    "We believe great design starts with clarity and trust. Find answers about our services, process and fees below.",
  groups: [
    { title: "Services", items: faqs.items.slice(0, 2) },
    { title: "Process & Fees", items: faqs.items.slice(2, 4) },
    {
      title: "Working Together",
      items: [
        ...faqs.items.slice(4),
        {
          question: "What happens in the first consultation?",
          answer:
            "We talk through your space, goals, timeline and budget, then outline how we would approach the project and what the next steps are.",
        },
        {
          question: "Do I need to have a budget in mind?",
          answer:
            "A rough range helps us recommend the right scope. We tailor materials and FF&E choices so the design stays within it.",
        },
      ],
    },
  ] satisfies FaqGroup[],
};
