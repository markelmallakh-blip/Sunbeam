import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Imported only from client components, so plugin registration never runs on the server. */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
