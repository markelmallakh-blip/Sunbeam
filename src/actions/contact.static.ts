import { validateContact, type ContactState } from "./contact-schema";

/*
 * Stand-in for the contact Server Action in the static GitHub Pages export, which has no
 * server to run it. next.config aliases "@/actions/contact" to this file for that build only.
 */
export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const { values, errors, valid } = validateContact(formData);
  if (!valid) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }
  return {
    status: "error",
    message: "Online inquiries open soon. Please email hello@sunbeam.com in the meantime.",
    values,
  };
}
