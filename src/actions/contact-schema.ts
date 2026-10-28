import {
  businessFields,
  countryCodes,
  projectTypes,
  serviceNeeds,
  unitTypes,
} from "@/content/contact";

export type ContactField =
  | "firstName"
  | "lastName"
  | "email"
  | "phoneCode"
  | "phone"
  | "projectType"
  | "businessField"
  | "unitType"
  | "service"
  | "message";

export type ContactValues = Record<ContactField, string>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Per-field messages, shown under each input. */
  errors?: Partial<Record<ContactField, string>>;
  /** What was sent, so the fields keep their values after a failed attempt. */
  values?: ContactValues;
  /** Client-side submit counter; re-mounts the fields so they pick up `values` again. */
  attempt?: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* The national part of the number, after the country code. */
const PHONE_PATTERN = /^[\d\s()-]{6,16}$/;

const oneOf = (list: readonly string[], value: string) => list.includes(value);

/*
 * Shared by the Server Action and its static-export stand-in. Business field is asked only for
 * commercial projects and unit type only for residential ones, so the other is cleared.
 */
export function validateContact(formData: FormData) {
  const read = (key: ContactField) => String(formData.get(key) ?? "").trim();
  const projectType = read("projectType");
  const values: ContactValues = {
    firstName: read("firstName"),
    lastName: read("lastName"),
    email: read("email"),
    phoneCode: read("phoneCode"),
    phone: read("phone"),
    projectType,
    businessField: projectType === "Commercial" ? read("businessField") : "",
    unitType: projectType === "Residential" ? read("unitType") : "",
    service: read("service"),
    message: read("message"),
  };

  const errors: ContactState["errors"] = {};
  if (values.firstName.length < 2) errors.firstName = "Please enter your first name.";
  if (values.lastName.length < 2) errors.lastName = "Please enter your last name.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Please enter a valid email address.";
  if (
    !oneOf(
      countryCodes.map((entry) => entry.code),
      values.phoneCode,
    ) ||
    !PHONE_PATTERN.test(values.phone)
  ) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!oneOf(projectTypes, values.projectType)) {
    errors.projectType = "Please choose residential or commercial.";
  } else if (projectType === "Commercial" && !oneOf(businessFields, values.businessField)) {
    errors.businessField = "Please choose your business field.";
  } else if (projectType === "Residential" && !oneOf(unitTypes, values.unitType)) {
    errors.unitType = "Please choose your unit type.";
  }
  if (!oneOf(serviceNeeds, values.service)) errors.service = "Please choose what you need.";
  if (values.message.length < 10) errors.message = "Please tell us a little more (10+ characters).";

  return { values, errors, valid: Object.keys(errors).length === 0 };
}
