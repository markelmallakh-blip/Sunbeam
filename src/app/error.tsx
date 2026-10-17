"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "@/components/layout/Container";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-stone pt-header">
      <Container className="flex min-h-[70svh] flex-col items-start justify-center gap-6 py-section">
        <Eyebrow className="text-slate">Something went wrong</Eyebrow>
        <h1 className="font-display text-h2">We couldn’t load this page.</h1>
        <p className="max-w-md text-small text-slate">Please try again in a moment.</p>
        <div className="flex gap-3">
          <Button onClick={retry} variant="dark">
            Try again
          </Button>
          <Button href="/" variant="outline-dark">
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  );
}
