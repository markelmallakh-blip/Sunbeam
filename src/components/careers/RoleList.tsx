import Link from "next/link";
import { Fragment } from "react";
import { roleHref, type Role } from "@/content/careers";
import { Icon } from "@/components/ui/Icon";

/* Department, location and type, split by small dots like the blog post meta. */
export function RoleMeta({ role }: { role: Role }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption font-medium tracking-[0.5px] text-slate sm:text-small">
      {[role.department, role.location, role.type].map((part, index) => (
        <Fragment key={part}>
          {index > 0 && <span aria-hidden className="size-[3px] rounded-full bg-slate" />}
          <span>{part}</span>
        </Fragment>
      ))}
    </p>
  );
}

/*
 * Open roles as edge-to-edge rows split by hairlines, the content held to the page's 1448px
 * column: title and meta on the left, an arrow in a square tile with the CTAs' corners on the
 * right. On hover a light grey band rises up behind the whole row and the tile fills in.
 */
export function RoleList({ roles }: { roles: Role[] }) {
  return (
    <ul className="w-full border-t border-hairline">
      {roles.map((role) => (
        <li key={role.slug} className="border-b border-hairline">
          <Link
            href={roleHref(role.slug)}
            className="group relative isolate block before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-mist before:transition-transform before:duration-300 before:ease-soft hover:before:scale-y-100 focus-visible:before:scale-y-100"
          >
            <span className="mx-auto flex max-w-[90.5rem] items-center justify-between gap-6 px-edge py-5 sm:py-8">
              <span className="flex flex-col gap-2">
                <span className="text-heading-5 font-semibold text-ink">{role.title}</span>
                <RoleMeta role={role} />
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-[4px] border border-hairline bg-white text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white sm:size-12">
                <Icon name="arrow-right" size={20} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
