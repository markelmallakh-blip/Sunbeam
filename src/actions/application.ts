"use server";

import { validateApplication, type ApplicationState } from "./application-schema";

/*
 * Job application Server Action. Validates the form and forwards it, CV included, as
 * multipart/form-data to APPLICATION_WEBHOOK_URL (e.g. a Make/Zapier hook or a mail service);
 * without one it says so instead of dropping the application. next.config raises the Server
 * Action body limit so a 20 MB PDF fits.
 */
export async function sendApplication(
  _previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const { values, file, errors, valid } = validateApplication(formData);
  if (!valid || !file) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const endpoint = process.env.APPLICATION_WEBHOOK_URL;
  if (!endpoint) {
    return {
      status: "error",
      message: "Online applications are not connected yet. Please email hello@sunbeam.com.",
      values,
    };
  }

  try {
    const body = new FormData();
    for (const [key, value] of Object.entries(values)) body.append(key, value);
    body.append("cv", file, file.name);
    body.append("sentAt", new Date().toISOString());
    const response = await fetch(endpoint, { method: "POST", body });
    if (!response.ok) throw new Error(`Application endpoint responded ${response.status}`);
    return {
      status: "success",
      message: "Thank you — your application is in. We reply to every applicant within two weeks.",
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Something went wrong. Please try again later.", values };
  }
}
