import { cacheLife } from "next/cache";

/* Cached at build time and refreshed daily, so the static footer never needs request-time rendering. */
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
