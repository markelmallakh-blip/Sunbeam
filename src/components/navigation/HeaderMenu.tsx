import Image from "next/image";
import Link from "next/link";
import { projectsMenu, servicesMenu, type MenuKey } from "@/config/navigation";
import { Button } from "@/components/ui/Button";

type HeaderMenuProps = {
  menu: MenuKey;
  /** Closes the menu once a link is followed. */
  onNavigate: () => void;
};

/*
 * Dropdown panels under the header: Figma "Projects menu" (116:6109) and "Services menu"
 * (116:6904). White, 32px padding, sitting on the 90% black page wash the header draws.
 */
export function HeaderMenu({ menu, onNavigate }: HeaderMenuProps) {
  if (menu === "services") {
    return (
      <div className="grid gap-4 p-8 md:grid-cols-2">
        {servicesMenu.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            onClick={onNavigate}
            className="group relative isolate flex h-[min(35.875rem,62svh)] flex-col items-center justify-end gap-3 overflow-hidden p-6 text-center text-white"
          >
            <Image
              src={service.image}
              alt={service.alt}
              fill
              sizes="50vw"
              quality={85}
              style={"focus" in service ? { objectPosition: service.focus } : undefined}
              className="-z-10 object-cover transition-transform duration-1000 ease-soft group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-linear-to-b from-transparent from-50% to-black/60"
            />
            <span className="text-heading-4 font-semibold">{service.title}</span>
            <span className="max-w-[34rem] text-body tracking-[0.5px]">{service.description}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="grid w-full grid-cols-5 gap-4">
        {projectsMenu.columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-5">
            <div className="relative h-[10.1875rem] overflow-hidden">
              <Image
                src={column.image}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
                style={{ objectPosition: column.position }}
              />
            </div>
            <div className="flex flex-col items-start gap-4 tracking-[0.5px] text-ink">
              <p className="text-small font-semibold">{column.title}</p>
              <ul className="flex flex-col items-start gap-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="link-underline text-body"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <Button href={projectsMenu.cta.href} onClick={onNavigate} variant="light">
        {projectsMenu.cta.label}
      </Button>
    </div>
  );
}
