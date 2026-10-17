import type { NewsletterState } from "./newsletter";

/*
 * Stand-in for the newsletter Server Action in the static GitHub Pages export, which has no
 * server to run it. next.config aliases "@/actions/newsletter" to this file for that build only.
 */
export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  return {
    status: "error",
    message: "Newsletter sign-up opens soon. Please email us in the meantime.",
  };
}

export type { NewsletterState };
