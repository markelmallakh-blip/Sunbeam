import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { PageTransition } from "@/components/transitions/PageTransition";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { alqest, montserrat } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 800, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2c2929",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${alqest.variable} ${montserrat.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll />
          <PageTransition>
            <AnnouncementBar />
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </PageTransition>
        </MotionProvider>
      </body>
    </html>
  );
}
