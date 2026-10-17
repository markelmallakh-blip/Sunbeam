"use client";

import { useActionState, useId } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/actions/newsletter";
import { buttonClasses } from "./Button";
import { RollText } from "./RollText";
import { cn } from "@/lib/cn";

const initialState: NewsletterState = { status: "idle", message: "" };

/* Figma "Input Fields" (48:4780) paired with the dark CTA, as in the footer. */
export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);
  const inputId = useId();
  const messageId = useId();

  return (
    <form action={formAction} noValidate className="w-full max-w-[26.125rem]">
      <div className="flex h-14 items-center gap-2 bg-linen p-2.5 focus-within:outline focus-within:outline-line">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Enter Email Address"
          aria-describedby={state.message ? messageId : undefined}
          aria-invalid={state.status === "error" || undefined}
          className="min-w-0 flex-1 bg-transparent px-1 text-body text-ink placeholder:text-slate focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className={buttonClasses({ variant: "dark", size: "sm", className: "h-full" })}
        >
          <RollText>{pending ? "Sending…" : "Subscribe"}</RollText>
        </button>
      </div>
      <p
        id={messageId}
        role="status"
        className={cn(
          "mt-2 min-h-5 text-caption",
          state.status === "error" ? "text-rust" : "text-slate",
        )}
      >
        {state.message}
      </p>
    </form>
  );
}
