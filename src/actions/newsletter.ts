"use server";

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const endpoint = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "error",
      message: "Newsletter sign-up is not available yet. Please email us instead.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(`Newsletter endpoint responded ${response.status}`);
    return { status: "success", message: "Thank you — you’re on the list." };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Something went wrong. Please try again later." };
  }
}
