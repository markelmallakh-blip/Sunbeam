"use client";

import { useActionState, useId, useRef, useState } from "react";
import { sendApplication } from "@/actions/application";
import {
  CV_MAX_BYTES,
  type ApplicationState,
  type ApplicationValues,
} from "@/actions/application-schema";
import { Field } from "@/components/contact/Field";
import { PhoneField } from "@/components/contact/PhoneField";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const initialState: ApplicationState = { status: "idle", message: "" };

/* Counts attempts so the fields re-mount with the returned values. */
async function submit(previous: ApplicationState, formData: FormData): Promise<ApplicationState> {
  const result = await sendApplication(previous, formData);
  return { ...result, attempt: (previous.attempt ?? 0) + 1 };
}

/*
 * Application form at the foot of a role page, in the contact form's fields: name, phone with its
 * country code, email, portfolio link, a CV upload (PDF, 20 MB at most) and a few words about
 * the applicant. Posts to the application Server Action with the role's title.
 */
export function ApplicationForm({ role }: { role: string }) {
  const [state, formAction, pending] = useActionState(submit, initialState);
  const id = useId();
  const values = state.values;
  const errors = state.errors ?? {};

  if (state.status === "success") {
    return (
      <p role="status" className="bg-linen p-8 text-center text-subtitle text-ink">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-3">
      <input type="hidden" name="role" value={role} />
      <Fields key={state.attempt ?? 0} id={id} values={values} errors={errors} />
      <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
        <p
          role="status"
          className={cn(
            "min-h-5 text-center text-small tracking-[0.5px] sm:text-left",
            state.status === "error" ? "text-rust" : "text-slate",
          )}
        >
          {state.message}
        </p>
        <button type="submit" disabled={pending} className={buttonClasses({ variant: "dark" })}>
          <span>{pending ? "Sending…" : "Submit application"}</span>
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

function Fields({
  id,
  values,
  errors,
}: {
  id: string;
  values?: ApplicationValues;
  errors: NonNullable<ApplicationState["errors"]>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
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
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <PhoneField
          id={`${id}-phone`}
          defaultCode={values?.phoneCode}
          defaultValue={values?.phone}
          error={errors.phone}
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
      </div>
      <Field
        id={`${id}-portfolio`}
        name="portfolio"
        type="url"
        label="Portfolio link"
        autoComplete="url"
        required
        defaultValue={values?.portfolio}
        error={errors.portfolio}
      />
      <CvField id={`${id}-cv`} error={errors.cv} />
      <Field
        id={`${id}-about`}
        as="textarea"
        name="about"
        label="Tell us more about yourself"
        required
        defaultValue={values?.about}
        error={errors.about}
      />
    </div>
  );
}

/*
 * CV upload: a dashed drop area in the fields' grey that names the chosen file. The size and
 * type are checked as soon as a file is picked; the Server Action checks them again.
 */
function CvField({ id, error }: { id: string; error?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const message = localError ?? error;
  const errorId = `${id}-error`;

  const accept = (picked: File | undefined) => {
    if (!picked) return;
    if (picked.type !== "application/pdf" && !picked.name.toLowerCase().endsWith(".pdf")) {
      setLocalError("Your CV needs to be a PDF.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (picked.size > CV_MAX_BYTES) {
      setLocalError("Your CV needs to be 20 MB or smaller.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setLocalError(null);
    setFile({ name: picked.name, size: `${(picked.size / 1024 / 1024).toFixed(1)} MB` });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const dropped = event.dataTransfer.files[0];
          if (dropped && inputRef.current) {
            const transfer = new DataTransfer();
            transfer.items.add(dropped);
            inputRef.current.files = transfer.files;
          }
          accept(dropped);
        }}
        className={cn(
          "flex cursor-pointer items-center gap-4 rounded-[4px] border border-dashed bg-linen px-3.5 py-3 transition-colors duration-300 has-focus-visible:border-line",
          message ? "border-rust" : dragging ? "border-ink" : "border-silver hover:border-line",
        )}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-[4px] bg-white text-ink">
          <Icon name="upload" size={18} />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-body tracking-[0.5px] text-ink">
            {file ? file.name : "Upload your CV"}
          </span>
          <span className="text-caption tracking-[0.5px] text-slate">
            {file ? `${file.size} · click to replace` : "PDF only, up to 20 MB"}
          </span>
        </span>
        <input
          ref={inputRef}
          id={id}
          name="cv"
          type="file"
          accept="application/pdf,.pdf"
          required
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? errorId : undefined}
          onChange={(event) => accept(event.target.files?.[0])}
          className="sr-only"
        />
      </label>
      {message && (
        <p id={errorId} className="text-caption tracking-[0.5px] text-rust">
          {message}
        </p>
      )}
    </div>
  );
}
