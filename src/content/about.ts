import type { ImageAsset } from "@/types/media";
import { withBase } from "@/lib/base-path";

/*
 * About page content for the 2026-10 redesign (Figma "About Us" 90:2460 on the "UI" page).
 * Copy and sample images are taken from the Figma frame as-is.
 */

const image = (file: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src: withBase(`/images/about-v2/${file}.webp`),
  alt,
  width,
  height,
});

export const aboutHero = {
  eyebrow: "About Us",
  title: ["Story Behind", "Sunbeam Spaces"],
  /* Used for the page's meta description. */
  intro:
    "Since 2021, Sunbeam Spaces Studio has shaped residential and commercial interiors across Egypt and beyond guided by light, material and the way people truly live.",
  /*
   * The clean photo from the previous About hero: the Figma sample has its fluted glass baked in,
   * and the refraction effect needs a clear photo to reveal under the pointer.
   */
  image: image(
    "hero-dining",
    "Dining room with a dark timber table, leather chairs and sheer curtains",
    2400,
    1076,
  ),
};

export type Stat = { value: string; label: string };

export const companyOverview = {
  title: "Company Overview",
  paragraphs: [
    "Since 2021, Sunbeam Spaces Studio has shaped residential and commercial interiors across Egypt and beyond guided by light, material and the way people truly live.",
    "At Sunbeam Design Studio, we believe great design is found in the balance between beauty, comfort, and purpose. We create thoughtful spaces that reflect each client's vision, bringing together creative interior design and turnkey FF&E solutions.",
    "From the first concept to the final detail, we take a considered approach to every project, carefully selecting materials, furniture, lighting, and finishes to ensure each element works in harmony. Our goal is to create spaces that feel cohesive, function effortlessly, and stand the test of time.",
  ],
  stats: [
    { value: "5+", label: "Years" },
    { value: "20+", label: "Project" },
    { value: "10+", label: "Specialist" },
    { value: "5+", label: "Countries" },
  ] satisfies Stat[],
};

/*
 * Figma "Container" Variant2 (152:2223) shows each value as a line illustration with a short
 * description. It leaves out Thoughtful Design, which has no illustration yet, so it is skipped there.
 */
export type Value = {
  title: string;
  image: ImageAsset;
  description: string;
  icon?: ImageAsset;
};

const valueIcon = (file: string) => image(`icon-${file}`, "", 280, 280);

/* Images are 2× renders of the Figma cards (283 × 320), so their crops match exactly. */
const valueImage = (file: string, alt: string) => image(`value-${file}`, alt, 566, 640);

export const values = {
  eyebrow: "Why Choose Sunbeam",
  title: "Values Behind Our Work",
  items: [
    {
      title: "Thoughtful Design",
      image: valueImage(
        "thoughtful-design",
        "Dining room framed by a planted screen and timber pendant lights",
      ),
      description:
        "Every space starts with how it will be lived in, then takes shape around light, flow and proportion.",
    },
    {
      title: "Attention to Detail",
      image: valueImage("attention-to-detail", "Wall-mounted desk with a sculpted lamp and chair"),
      icon: valueIcon("attention-to-detail"),
      description:
        "Every detail matters. We carefully consider every element to create refined, well-balanced spaces.",
    },
    {
      title: "Client-Centered Approach",
      image: valueImage("client-centered", "Sunbeam designers reviewing samples with clients"),
      icon: valueIcon("client-centered"),
      description:
        "We listen first and keep you involved at every step, so the finished space truly feels like yours.",
    },
    {
      title: "Lasting Quality",
      image: valueImage("lasting-quality", "Terrace dining table under a woven pendant light"),
      icon: valueIcon("lasting-quality"),
      description:
        "We choose materials, makers and finishes that hold up to daily life and age gracefully over time.",
    },
    {
      title: "Transparency",
      image: valueImage("transparency", "Two designers sharing a high-five across a meeting table"),
      icon: valueIcon("transparency"),
      description:
        "Clear budgets, honest timelines and open updates, so there are no surprises along the way.",
    },
  ] satisfies Value[],
};

export const purpose = {
  title: "Rooted in Purpose",
  statements: [
    {
      label: "Our Vision",
      text: "To be the region’s most trusted studio for calm, timeless interiors, homes and workplaces that age gracefully, where people feel at ease long after the reveal.",
    },
    {
      label: "Our Mission",
      text: "To design with intention, deliver with care and listen at every step — pairing thoughtful planning with carefully chosen materials, so our clients can simply enjoy the result.",
    },
  ],
};

export const founder = {
  title: "Meet Our Founder",
  letter: [
    "When I founded Sunbeam Design Studio, my vision was to create more than beautiful interiors. I wanted to create spaces that reflect the people who live and work in them, spaces that feel natural, serve a purpose, and leave a lasting impression.",
    "I believe great design begins with listening. Every client has a unique story, set of needs, and vision, and our role is to bring these together through thoughtful design and a clear sense of purpose. From the first ideas and space planning to the selection of furniture, materials, and finishing touches, every detail matters.",
    "For me, the true value of design lies in how a space makes you feel and how it becomes part of your everyday life. This is the vision that guides us, inspires our work, and continues to shape the future of Sunbeam Design Studio.",
  ],
  name: "Lina Magdy",
  role: "Founder of Sunbeam Design Studio",
  image: image(
    "founder-portrait",
    "Lina Magdy, founder of Sunbeam Design Studio, resting her chin on her hand",
    1512,
    1418,
  ),
};
