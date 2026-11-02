import { validateApplication, type ApplicationState } from "./application-schema";

/*
 * Stand-in for the application Server Action in the static GitHub Pages export, which has no
 * server to run it. next.config aliases "@/actions/application" to this file for that build only.
 */
export async function sendApplication(
  _previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const { values, errors, valid } = validateApplication(formData);
  if (!valid) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }
  return {
    status: "error",
    message: "Online applications open soon. Please email hello@sunbeam.com in the meantime.",
    values,
  };
}
