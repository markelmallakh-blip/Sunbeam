"use client";

import { useActionState, useId } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/actions/newsletter";
import { buttonClasses } from "./Button";
import { cn } from "@/lib/cn";

const initialState: NewsletterState = { status: "idle", message: "" };

/* Figma footer newsletter: a Gray .5 field (4px corners) holding the dark "Subscribe" CTA. */
export function NewsletterForm({ note }: { note?: string }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);
  const inputId = useId();
  const messageId = useId();

  return (
    <form action={formAction} noValidate className="w-full max-w-[26.125rem]">
      <div className="flex items-center gap-3 rounded-[4px] bg-linen py-2.5 pr-2.5 pl-3.5 focus-within:outline focus-within:outline-line">
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
          className="min-w-0 flex-1 bg-transparent text-body tracking-[0.5px] text-ink placeholder:text-slate focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className={buttonClasses({ variant: "dark", size: "md", className: "h-auto py-2.5" })}
        >
          {pending ? "Sending…" : "Subscribe"}
        </button>
      </div>
      <p
        id={messageId}
        role="status"
        className={cn(
          "mt-4 min-h-4 text-caption tracking-[0.5px]",
          state.status === "error" ? "text-rust" : "text-stone",
        )}
      >
        {state.message || note}
      </p>
    </form>
  );
}
