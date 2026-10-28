"use server";

import { validateContact, type ContactState } from "./contact-schema";

/*
 * Contact form Server Action. Validates the inquiry and forwards it as JSON to
 * CONTACT_WEBHOOK_URL (e.g. a Make/Zapier hook or a mail service); without one it says so,
 * like the newsletter action, instead of dropping the message.
 */
export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const { values, errors, valid } = validateContact(formData);
  if (!valid) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "error",
      message: "Our contact form is not connected yet. Please email hello@sunbeam.com instead.",
      values,
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, sentAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error(`Contact endpoint responded ${response.status}`);
    return {
      status: "success",
      message: "Thank you — your message is on its way. We’ll be in touch shortly.",
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Something went wrong. Please try again later.", values };
  }
}
