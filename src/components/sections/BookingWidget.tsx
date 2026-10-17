"use client";

import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import { consultation } from "@/content/home";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
/* Studio days are Sunday–Thursday (Friday and Saturday are the weekend in Egypt). */
const OPEN_DAYS = new Set([0, 1, 2, 3, 4]);
/* Slot start times in minutes after midnight. */
const SLOTS = [600, 660, 750, 840, 930, 1020, 1110];

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function formatSlot(minutes: number, hour12: boolean) {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, "0");
  if (!hour12) return `${String(h).padStart(2, "0")}:${m}`;
  return `${h % 12 || 12}:${m}${h < 12 ? "am" : "pm"}`;
}

const subscribeNever = () => () => {};
const getTodayKey = () => startOfDay(new Date()).toDateString();
const getServerTodayKey = () => null;

function firstOpenDay(from: Date) {
  const date = new Date(from);
  while (!OPEN_DAYS.has(date.getDay())) date.setDate(date.getDate() + 1);
  return date;
}

function monthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const blanks = Array.from({ length: first.getDay() }, () => null);
  const days = Array.from(
    { length: count },
    (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
  );
  return [...blanks, ...days];
}

/* Figma "Design Consultation" card: pick a day and a time, then send the request by email. */
export function BookingWidget() {
  const { booking } = consultation;
  /* The current date only exists in the browser: null while prerendering, real after hydration. */
  const todayKey = useSyncExternalStore(subscribeNever, getTodayKey, getServerTodayKey);
  const today = useMemo(() => (todayKey ? new Date(todayKey) : null), [todayKey]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [picked, setPicked] = useState<Date | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [hour12, setHour12] = useState(true);

  const month = useMemo(
    () => (today ? new Date(today.getFullYear(), today.getMonth() + monthOffset, 1) : null),
    [today, monthOffset],
  );
  const day = picked ?? (today ? firstOpenDay(today) : null);
  const days = useMemo(() => (month ? monthDays(month) : []), [month]);
  const isOpen = (date: Date) => today !== null && date >= today && OPEN_DAYS.has(date.getDay());
  const shiftMonth = (step: number) => setMonthOffset((value) => value + step);

  const request =
    day && slot !== null
      ? `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
          `${booking.event} request — ${day.toDateString()} at ${formatSlot(slot, hour12)} (Cairo time)`,
        )}`
      : undefined;

  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-white text-ink">
      <div className="grid md:grid-cols-[13rem_1fr] lg:grid-cols-[13rem_1fr_13.75rem]">
        <div className="flex flex-col gap-2 border-rule p-6 md:border-r">
          <Image
            src={booking.hostImage.src}
            alt=""
            width={booking.hostImage.width}
            height={booking.hostImage.height}
            sizes="48px"
            className="size-12 rounded-full object-cover"
          />
          <p className="mt-2 text-small text-slate">{booking.host}</p>
          <h3 className="text-subtitle font-semibold">{booking.event}</h3>
          <p className="mt-2 text-small text-slate">{booking.summary}</p>
          <ul className="mt-3 flex flex-col gap-2 text-small font-medium">
            {booking.details.map((detail) => (
              <li key={detail.label} className="flex items-center gap-2">
                <Icon name={detail.icon} size={16} />
                {detail.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-rule p-6 lg:border-r">
          <div className="flex items-center justify-between">
            <p className="text-body font-semibold" aria-live="polite">
              {month?.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </p>
            <div className="flex">
              <button
                type="button"
                aria-label="Previous month"
                disabled={monthOffset <= 0}
                onClick={() => shiftMonth(-1)}
                className="grid size-8 place-items-center disabled:opacity-30"
              >
                <Icon name="arrow-left" size={14} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
                className="grid size-8 place-items-center"
              >
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          </div>
          <div
            role="group"
            aria-label="Choose a day"
            className="mt-4 grid grid-cols-7 gap-1 text-center"
          >
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="pb-2 text-caption text-slate uppercase">
                {weekday}
              </span>
            ))}
            {days.map((date, i) =>
              date ? (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={!isOpen(date)}
                  aria-pressed={day ? sameDay(date, day) : false}
                  aria-label={date.toDateString()}
                  onClick={() => {
                    setPicked(date);
                    setSlot(null);
                  }}
                  className={cn(
                    "aspect-square rounded-md text-small font-semibold transition-colors",
                    "disabled:bg-transparent disabled:font-normal disabled:text-slate/50",
                    day && sameDay(date, day) ? "bg-ink text-white" : "bg-stone hover:bg-rule",
                  )}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span key={`blank-${i}`} />
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-rule p-6 md:col-span-2 lg:col-span-1 lg:border-t-0">
          <div className="flex items-center justify-between">
            <p className="text-body font-semibold">
              {day?.toLocaleDateString("en-GB", { weekday: "short" })}{" "}
              <span className="font-normal text-slate">{day?.getDate()}</span>
            </p>
            <div
              className="flex rounded-md border border-rule p-0.5 text-caption"
              role="group"
              aria-label="Time format"
            >
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  aria-pressed={hour12 === value}
                  onClick={() => setHour12(value)}
                  className={cn("rounded px-1.5 py-0.5", hour12 === value && "bg-stone")}
                >
                  {value ? "12h" : "24h"}
                </button>
              ))}
            </div>
          </div>
          <ul className="flex flex-col gap-2" aria-label="Available times">
            {SLOTS.map((minutes) => (
              <li key={minutes}>
                <button
                  type="button"
                  disabled={!day}
                  aria-pressed={slot === minutes}
                  onClick={() => setSlot(minutes)}
                  className={cn(
                    "flex h-11 w-full items-center justify-center gap-2 rounded-md border text-small font-semibold transition-colors",
                    slot === minutes
                      ? "border-ink bg-ink text-white"
                      : "border-rule hover:border-ink",
                  )}
                >
                  {slot !== minutes && (
                    <span className="size-1.5 rounded-full bg-ink/60" aria-hidden />
                  )}
                  {formatSlot(minutes, hour12)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-rule px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-slate">Times shown in Africa/Cairo (GMT+3)</p>
        {request ? (
          <Button href={request} variant="dark" size="sm">
            Request this time
          </Button>
        ) : (
          <p className="text-caption text-slate">Select a day and time to continue</p>
        )}
      </div>
    </div>
  );
}
