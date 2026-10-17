import type { ImageAsset, VideoAsset } from "@/types/media";
import { story as homeStory } from "./home";

/*
 * About page content, following the Figma "About Us" frame (54:687). Kept apart from
 * presentation so copy and media can be replaced (or moved to a CMS) without touching components.
 */

const image = (src: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src,
  alt,
  width,
  height,
});

const [teamImage, lightingImage] = homeStory.images;

export const aboutHero = {
  eyebrow: "About Us",
  title: ["Story Behind", "Sunbeam Spaces"],
  intro:
    "Since 2021, Sunbeam Spaces Studio has shaped residential and commercial interiors across Egypt and beyond guided by light, material and the way people truly live.",
  image: image(
    "/images/about/hero.webp",
    "A Sunbeam hospitality interior with sculpted timber ceiling ribbons, sheer curtains and sea views",
    2400,
    1076,
  ),
  /** `value` counts up from zero; `suffix` follows it unchanged. */
  stats: [
    { value: 5, suffix: "", label: "Years in the Market" },
    { value: 20, suffix: "+", label: "Projects Delivered" },
    { value: 30, suffix: "+", label: "Designers & specialists" },
    { value: 5, suffix: "", label: "Countries worked in" },
  ],
};

export const companyOverview = {
  title: "Company Overview",
  paragraphs: [
    "At Sunbeam Design Studio, we believe great design is found in the balance between beauty, comfort, and purpose. We create thoughtful spaces that reflect each client's vision, bringing together creative interior design and turnkey FF&E solutions.",
    "From the first concept to the final detail, we take a considered approach to every project, carefully selecting materials, furniture, lighting, and finishes to ensure each element works in harmony. Our goal is to create spaces that feel cohesive, function effortlessly, and stand the test of time.",
  ],
  image: image(
    "/images/about/overview.webp",
    "A Sunbeam workplace interior with a long meeting table, a textured artwork wall and exposed ceiling services",
    920,
    1150,
  ),
};

export const ourStory = {
  eyebrow: "Our Story",
  title: "From a small studio to spaces across the region.",
  text: "What began as a two-person studio with a love for natural light and honest materials has grown into a team trusted with homes, hospitality and workplaces without losing the care of a small practice.",
  /* Silent landscape loop cut from the studio film until a dedicated reel is supplied. */
  loop: {
    type: "video",
    src: "/videos/story-loop.webm",
    mimeType: "video/webm",
    label: "Sunbeam's founder in the studio",
    poster: "/images/about/story-loop-poster.webp",
    width: 720,
    height: 468,
  } satisfies VideoAsset,
  film: homeStory.teaser.film,
  filmLabel: "Watch the film",
};

/* Each line of the heading carries one value tag, tilted alternately (Figma 73:1457). */
export const values = {
  eyebrow: "Why Choose Sunbeam",
  lines: [
    { word: "Values", tag: "Thoughtful Design", side: "end" },
    { word: "Behind", tag: "Attention to Detail", side: "start" },
    { word: "Our", tag: "Client-Centered Approach", side: "end" },
    /* Figma repeats "Thoughtful Design" here — likely a placeholder for a fourth value. */
    { word: "Work", tag: "Thoughtful Design", side: "start" },
  ] as const,
};

export const founder = {
  title: "Founder Message",
  paragraphs: [
    "When I founded Sunbeam Design Studio, my vision was to create more than beautiful interiors. I wanted to create spaces that reflect the people who live and work in them, spaces that feel natural, serve a purpose, and leave a lasting impression.",
    "I believe great design begins with listening. Every client has a unique story, set of needs, and vision, and our role is to bring these together through thoughtful design and a clear sense of purpose. From the first ideas and space planning to the selection of furniture, materials, and finishing touches, every detail matters.",
    "For me, the true value of design lies in how a space makes you feel and how it becomes part of your everyday life. This is the vision that guides us, inspires our work, and continues to shape the future of Sunbeam Design Studio.",
  ],
  name: "Lina Magdy",
  role: "Founder of Sunbeam Design Studio",
  portrait: image(
    "/images/about/founder.webp",
    "Lina Magdy, founder of Sunbeam Design Studio, seated in an ochre wingback chair",
    720,
    788,
  ),
};

export const visionMission = [
  {
    title: "Our Vision",
    text: "To be the region’s most trusted studio for calm, timeless interiors. We imagine homes and workplaces that age gracefully spaces people feel at ease in long after the reveal.",
    images: [lightingImage, teamImage],
  },
  {
    title: "Our Mission",
    text: "To design with intention, deliver with care and listen at every step, We pair thoughtful planning with carefully chosen materials and furniture, managing every detail so our clients can simply enjoy the result.",
    images: [lightingImage, teamImage],
  },
] satisfies { title: string; text: string; images: (ImageAsset | undefined)[] }[];
