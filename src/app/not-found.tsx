import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="bg-stone pt-header">
      <Container className="flex min-h-[70svh] flex-col items-start justify-center gap-6 py-section">
        <Eyebrow className="text-slate">Error 404</Eyebrow>
        <h1 className="font-display text-h2">This space isn’t designed yet.</h1>
        <p className="max-w-md text-small text-slate">
          The page you are looking for has moved or does not exist.
        </p>
        <Button href="/" variant="dark">
          Back to home
        </Button>
      </Container>
    </section>
  );
}
