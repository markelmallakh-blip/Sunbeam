import { countryCodes } from "@/content/contact";

export type ApplicationField =
  | "role"
  | "firstName"
  | "lastName"
  | "phoneCode"
  | "phone"
  | "email"
  | "portfolio"
  | "cv"
  | "about";

/* Text values only: the CV file can't be sent back to the browser after a failed attempt. */
export type ApplicationValues = Record<Exclude<ApplicationField, "cv">, string>;

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<ApplicationField, string>>;
  values?: ApplicationValues;
  /** Client-side submit counter; re-mounts the fields so they pick up `values` again. */
  attempt?: number;
};

/* The CV must be a PDF of at most 20 MB (the form and the Server Action both check). */
export const CV_MAX_BYTES = 20 * 1024 * 1024;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\s()-]{6,16}$/;

function isUrl(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

/* Shared by the Server Action and its static-export stand-in. */
export function validateApplication(formData: FormData) {
  const read = (key: Exclude<ApplicationField, "cv">) => String(formData.get(key) ?? "").trim();
  const values: ApplicationValues = {
    role: read("role"),
    firstName: read("firstName"),
    lastName: read("lastName"),
    phoneCode: read("phoneCode"),
    phone: read("phone"),
    email: read("email"),
    portfolio: read("portfolio"),
    about: read("about"),
  };
  const cv = formData.get("cv");
  const file = cv instanceof File && cv.size > 0 ? cv : null;

  const errors: ApplicationState["errors"] = {};
  if (values.firstName.length < 2) errors.firstName = "Please enter your first name.";
  if (values.lastName.length < 2) errors.lastName = "Please enter your last name.";
  if (
    !countryCodes.some((entry) => entry.code === values.phoneCode) ||
    !PHONE_PATTERN.test(values.phone)
  ) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Please enter a valid email address.";
  if (!isUrl(values.portfolio)) errors.portfolio = "Please add a link to your portfolio.";
  if (!file) errors.cv = "Please upload your CV.";
  else if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    errors.cv = "Your CV needs to be a PDF.";
  } else if (file.size > CV_MAX_BYTES) errors.cv = "Your CV needs to be 20 MB or smaller.";
  if (values.about.length < 20) errors.about = "Please tell us a little more (20+ characters).";

  return { values, file, errors, valid: Object.keys(errors).length === 0 };
}
