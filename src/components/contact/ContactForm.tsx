"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useActionState, useId, useState } from "react";
import { sendContactMessage } from "@/actions/contact";
import type { ContactState, ContactValues } from "@/actions/contact-schema";
import {
  businessFields,
  projectTypes,
  serviceNeeds,
  unitTypes,
  type ProjectType,
  type ServiceNeed,
} from "@/content/contact";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { easeSoft } from "@/lib/motion";
import { Field } from "./Field";
import { PhoneField } from "./PhoneField";
import { SegmentedControl } from "./SegmentedControl";
import { SelectField } from "./SelectField";

const initialState: ContactState = { status: "idle", message: "" };

/* Counts attempts so the fields re-mount with the returned values (stateful fields keep defaults). */
async function submit(previous: ContactState, formData: FormData): Promise<ContactState> {
  const result = await sendContactMessage(previous, formData);
  return { ...result, attempt: (previous.attempt ?? 0) + 1 };
}

/*
 * Inquiry form posted to the contact Server Action: first and last name, email, phone with its
 * country code, residential or commercial (which then asks for the unit type or the business
 * field), what the client needs, and a message. Values come back with any errors, so a failed
 * attempt keeps what was typed.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submit, initialState);
  const id = useId();
  const values = state.values;
  const errors = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <FormFields key={state.attempt ?? 0} id={id} values={values} errors={errors} />
      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          className={cn(
            "min-h-5 text-small tracking-[0.5px]",
            state.status === "error" ? "text-rust" : "text-slate",
          )}
        >
          {state.message}
        </p>
        <button type="submit" disabled={pending} className={buttonClasses({ variant: "dark" })}>
          <span>{pending ? "Sending…" : "Send message"}</span>
          <Icon
            name="arrow-right"
            size={14}
            className="transition-transform duration-500 ease-soft group-hover/btn:translate-x-1"
          />
        </button>
      </div>
    </form>
  );
}

function FormFields({
  id,
  values,
  errors,
}: {
  id: string;
  values?: ContactValues;
  errors: NonNullable<ContactState["errors"]>;
}) {
  const [projectType, setProjectType] = useState(values?.projectType ?? "");
  const followUp =
    projectType === "Commercial"
      ? { name: "businessField", label: "Business field", options: businessFields }
      : projectType === "Residential"
        ? { name: "unitType", label: "Unit type", options: unitTypes }
        : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${id}-first`}
          name="firstName"
          label="First name"
          autoComplete="given-name"
          required
          defaultValue={values?.firstName}
          error={errors.firstName}
        />
        <Field
          id={`${id}-last`}
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          required
          defaultValue={values?.lastName}
          error={errors.lastName}
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          required
          defaultValue={values?.email}
          error={errors.email}
        />
        <PhoneField
          id={`${id}-phone`}
          defaultCode={values?.phoneCode}
          defaultValue={values?.phone}
          error={errors.phone}
        />
      </div>

      <SegmentedControl
        name="projectType"
        label="Project type"
        options={projectTypes}
        defaultValue={values?.projectType as ProjectType | undefined}
        onChange={setProjectType}
        error={errors.projectType}
      />
      {/* The follow-up question slides open once residential or commercial is chosen. */}
      <AnimatePresence initial={false} mode="wait">
        {followUp && (
          <motion.div
            key={followUp.name}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeSoft }}
            className="overflow-hidden"
          >
            <SelectField
              id={`${id}-${followUp.name}`}
              name={followUp.name}
              label={followUp.label}
              options={followUp.options}
              defaultValue={
                followUp.name === "businessField" ? values?.businessField : values?.unitType
              }
              error={followUp.name === "businessField" ? errors.businessField : errors.unitType}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SegmentedControl
        name="service"
        label="I need"
        options={serviceNeeds}
        defaultValue={values?.service as ServiceNeed | undefined}
        error={errors.service}
      />

      <Field
        id={`${id}-message`}
        as="textarea"
        name="message"
        label="Tell us about your project"
        required
        defaultValue={values?.message}
        error={errors.message}
      />
    </div>
  );
}
