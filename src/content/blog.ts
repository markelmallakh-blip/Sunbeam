import type { ImageAsset } from "@/types/media";
import { withBase } from "@/lib/base-path";

/*
 * Blog & News posts — the single source for the /blog list, each /blog/[slug] page and the
 * homepage "Blog & News" section (which shows the first three). The first three titles, excerpts
 * and images come from Figma ("Blog" 180:6395); the rest, and every post body, are placeholder
 * copy to be replaced with the studio's articles.
 */

const image = (file: string, alt: string, width: number, height: number): ImageAsset => ({
  type: "image",
  src: withBase(`/images/blog/${file}.webp`),
  alt,
  width,
  height,
});

export type PostCategory = "Blog" | "News";

/** One block of the article body, rendered in order in the reading column. */
export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: ImageAsset; caption?: string };

export type Post = {
  slug: string;
  category: PostCategory;
  date: string;
  title: string;
  excerpt: string;
  image: ImageAsset;
  readingTime: string;
  /** Placeholder body until the studio supplies the article. */
  body: PostBlock[];
};

const bedroom = image(
  "post-design-show-expo",
  "Bright bedroom with a patterned throw and a mirrored wardrobe",
  1200,
  923,
);

/* Placeholder article body, shared by every post until real copy is written. */
const placeholderBody = (inline: ImageAsset): PostBlock[] => [
  {
    type: "paragraph",
    text: "Placeholder article — the final copy will be supplied by the Sunbeam team. Good interiors begin long before the first piece of furniture arrives. They start with how a space is used: where morning light falls, how people move between rooms, and which moments deserve a pause.",
  },
  {
    type: "paragraph",
    text: "We begin every project by listening. A short conversation about routines, habits and the feeling a client wants to come home to shapes every decision that follows, from the floor plan to the smallest finish.",
  },
  { type: "heading", text: "Start with Light and Proportion" },
  {
    type: "paragraph",
    text: "Natural light is the most generous material we work with. We plan layouts around it, choose finishes that soften it and layer lamps so evenings feel as considered as the day.",
  },
  {
    type: "quote",
    text: "A calm space is not an empty one — it is a space where every piece has a reason to be there.",
    cite: "Lina Magdy, Founder",
  },
  {
    type: "paragraph",
    text: "Proportion follows. A sofa that is a few centimetres too deep or a rug that stops short of the furniture can unsettle an entire room. Measuring twice and sampling materials in the actual space saves both time and budget.",
  },
  {
    type: "image",
    image: inline,
    caption: "Materials sampled on site before the final selection.",
  },
  { type: "heading", text: "Choose Fewer, Better Pieces" },
  {
    type: "paragraph",
    text: "Rather than filling a room at once, we select a handful of pieces that carry it — a dining table, a lounge chair, a statement light — and let the rest of the space breathe around them.",
  },
  {
    type: "paragraph",
    text: "The result is a home that ages gracefully: comfortable today, and just as easy to live in years after the reveal.",
  },
];

const inlineDetail = image(
  "post-statement-pieces",
  "Living room with a green lounge chair and a sculpted coffee table",
  1200,
  923,
);

export const posts: Post[] = [
  {
    slug: "meet-us-at-the-design-show-expo",
    category: "News",
    date: "18 - 20 Nov 2026",
    title: "Meet Us at The Design Show Expo",
    excerpt:
      "Explore how to combine aesthetics and practicality to create interiors that feel beautiful, comfortable, and effortless to live in.",
    image: bedroom,
    readingTime: "3 min read",
    body: placeholderBody(inlineDetail),
  },
  {
    slug: "5-ways-to-balance-your-space-colors",
    category: "Blog",
    date: "21 Oct 2026",
    title: "5 Ways to Balance Your Space Colors",
    excerpt:
      "Explore how to combine aesthetics and practicality to create interiors that feel beautiful, comfortable, and effortless to live in.",
    image: image(
      "post-balance-colors",
      "Bright bedroom with a patterned throw and a mirrored wardrobe",
      1200,
      923,
    ),
    readingTime: "5 min read",
    body: placeholderBody(inlineDetail),
  },
  {
    slug: "2027-bathrooms-trends",
    category: "Blog",
    date: "21 Oct 2026",
    title: "2027 Bathrooms Trends",
    excerpt:
      "Discover how thoughtful design, natural materials, and carefully selected details create spaces that remain beautiful beyond trends.",
    image: image(
      "post-bathroom-trends",
      "Bathroom vanity with a round mirror, brass taps and green tiles",
      1200,
      1333,
    ),
    readingTime: "4 min read",
    body: placeholderBody(inlineDetail),
  },
  {
    slug: "designing-open-plan-living",
    category: "Blog",
    date: "08 Oct 2026",
    title: "Designing Open-Plan Living",
    excerpt:
      "How zoning, lighting and a few anchoring pieces turn one large room into a home with distinct, calm moments.",
    image: image(
      "post-open-plan",
      "Open-plan dining and living room with pendant lights and timber finishes",
      1600,
      1231,
    ),
    readingTime: "4 min read",
    body: placeholderBody(inlineDetail),
  },
  {
    slug: "baxters-restaurant-opens-in-new-cairo",
    category: "News",
    date: "24 Sep 2026",
    title: "Baxters Restaurant Opens in New Cairo",
    excerpt:
      "Timber beams, monochrome tiles and soft pendant light — a first look at our latest hospitality project.",
    image: image(
      "post-baxters-opening",
      "Baxters restaurant with timber beams, pendant lights and a monochrome tiled floor",
      1200,
      1440,
    ),
    readingTime: "2 min read",
    body: placeholderBody(inlineDetail),
  },
  {
    slug: "choosing-statement-pieces",
    category: "Blog",
    date: "10 Sep 2026",
    title: "Choosing Statement Pieces",
    excerpt:
      "One remarkable chair or table can carry a whole room. Here is how we choose the pieces that lead a space.",
    image: inlineDetail,
    readingTime: "3 min read",
    body: placeholderBody(bedroom),
  },
  {
    slug: "a-practical-guide-to-ffe",
    category: "Blog",
    date: "27 Aug 2026",
    title: "A Practical Guide to FF&E",
    excerpt:
      "From sourcing to installation, what a turnkey furniture, fixtures and equipment package really includes.",
    image: image(
      "post-ffe-guide",
      "Modular sofa with striped cushions around a round stone coffee table",
      1600,
      1778,
    ),
    readingTime: "6 min read",
    body: placeholderBody(inlineDetail),
  },
  {
    slug: "calm-clinics-patient-comfort",
    category: "News",
    date: "12 Aug 2026",
    title: "Calm Clinics: Designing for Comfort",
    excerpt:
      "Inside FAMM Dental Clinic, where colour, art and light take the edge off a visit to the dentist.",
    image: image(
      "post-clinic-design",
      "FAMM dental clinic waiting area with a blue door and framed prints",
      1200,
      1440,
    ),
    readingTime: "3 min read",
    body: placeholderBody(inlineDetail),
  },
  {
    slug: "coastal-homes-that-breathe",
    category: "Blog",
    date: "30 Jul 2026",
    title: "Coastal Homes That Breathe",
    excerpt:
      "Linen, stone and an open outlook to the sea — designing summer homes that stay cool, light and easy.",
    image: image(
      "post-coastal-homes",
      "Almaza Bay villa living room opening onto a sea view",
      1200,
      800,
    ),
    readingTime: "4 min read",
    body: placeholderBody(inlineDetail),
  },
];

export const blogPage = {
  eyebrow: "Stay Updated",
  title: "Our Blog & News",
  categories: ["Blog", "News"] satisfies PostCategory[],
};

export const postSlugs = posts.map((post) => post.slug);

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

/** Up to three other posts, same category first. */
export function relatedPosts(slug: string, count = 3) {
  const current = getPost(slug);
  const others = posts.filter((post) => post.slug !== slug);
  const sameCategory = others.filter((post) => post.category === current?.category);
  const rest = others.filter((post) => post.category !== current?.category);
  return [...sameCategory, ...rest].slice(0, count);
}
