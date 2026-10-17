import localFont from "next/font/local";

/* Brand fonts self-hosted via next/font (no runtime third-party requests, no layout shift). */
export const alqest = localFont({
  src: "../fonts/Alqest-Regular.otf",
  weight: "400",
  display: "swap",
  variable: "--font-alqest",
  fallback: ["Times New Roman", "serif"],
});

export const montserrat = localFont({
  src: "../fonts/Montserrat-VariableFont_wght.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-montserrat",
  fallback: ["Arial", "sans-serif"],
});
