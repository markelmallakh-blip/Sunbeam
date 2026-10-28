import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  name: string;
  label: string;
  error?: string;
  defaultValue?: string;
  required?: boolean;
} & (
  | { as?: "input"; type?: "text" | "email" | "tel"; autoComplete?: string }
  | { as: "textarea" }
  | { as: "select"; options: readonly string[] }
);

const box =
  "peer block w-full rounded-[4px] border border-transparent bg-linen px-3.5 text-body tracking-[0.5px] text-ink outline-none transition-colors duration-300 focus:border-line aria-invalid:border-rust";

/*
 * Figma "Input Fields" (48:4780): Gray .5 field, 4px corners, 56px tall. The label sits inside as
 * a placeholder and floats up to 12px Secondary Dark Text once the field is focused or filled;
 * focus adds the 1px Dark 7 border. Types: Default, Choose (select with chevron) and a textarea.
 */
export function Field(props: FieldProps) {
  const { id, name, label, error, defaultValue, required } = props;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    required,
    defaultValue,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

  let control: ReactNode;
  if (props.as === "textarea") {
    control = (
      <textarea {...shared} rows={5} placeholder=" " className={cn(box, "resize-y pt-7 pb-3")} />
    );
  } else if (props.as === "select") {
    control = (
      <>
        <select
          {...shared}
          defaultValue={defaultValue ?? ""}
          className={cn(box, "h-14 appearance-none pt-5 pr-10 invalid:text-transparent")}
        >
          <option value="" disabled hidden />
          {props.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Icon
          name="arrow-down"
          size={20}
          className="pointer-events-none absolute top-[1.125rem] right-3.5 text-ink"
        />
      </>
    );
  } else {
    control = (
      <input
        {...shared}
        type={props.type ?? "text"}
        autoComplete={props.autoComplete}
        placeholder=" "
        className={cn(box, "h-14 pt-5")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {control}
        {/* Order after the control so peer-* can float it; the select floats once a value is chosen. */}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute top-4 left-3.5 origin-left text-body tracking-[0.5px] text-slate transition-all duration-300 ease-soft",
            "peer-focus:top-2 peer-focus:text-caption",
            props.as === "select"
              ? "peer-valid:top-2 peer-valid:text-caption"
              : "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-caption",
          )}
        >
          {label}
          {!required && <span className="text-silver"> (optional)</span>}
        </label>
      </div>
      {error && (
        <p id={errorId} className="text-caption tracking-[0.5px] text-rust">
          {error}
        </p>
      )}
    </div>
  );
}
