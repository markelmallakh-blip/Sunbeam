import Link from "next/link";
import { footerNavigation, legalNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { newsletter } from "@/content/homepage";
import { Icon } from "@/components/ui/Icon";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { CopyrightYear } from "@/components/layout/CopyrightYear";

const linkClass = "link-underline text-body tracking-[0.5px] text-white";

/*
 * Figma "Footer" (111:2992): black, four link columns (contact details under Support) and the
 * newsletter spread evenly across the width (the nav dissolves into that row on desktop), then a
 * Dark 9 rule over the legal row.
 */
export function Footer() {
  return (
    <footer id="footer" className="bg-black px-edge pt-block pb-8 text-white">
      <div className="flex flex-col gap-stack">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-8">
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 md:flex md:justify-between md:gap-8 lg:contents"
          >
            {footerNavigation.map((column) => (
              <div key={column.title} className="flex flex-col items-start gap-6">
                <h2 className="text-small font-medium tracking-[1px] text-stone uppercase">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-6">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {column.title === "Support" && (
                    <>
                      <li>
                        <a
                          href={`mailto:${siteConfig.contact.email}`}
                          className="flex items-center gap-2 text-body tracking-[0.5px] hover:text-stone"
                        >
                          <Icon name="mail" size={20} />
                          {siteConfig.contact.email}
                        </a>
                      </li>
                      <li className="flex items-center gap-2 text-body tracking-[0.5px]">
                        <Icon name="location" size={20} className="shrink-0" />
                        <address className="not-italic">{siteConfig.contact.address}</address>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-6">
            <div className="flex w-full flex-col gap-4">
              <h2 className="max-w-[22.5rem] text-heading-6 font-semibold">{newsletter.title}</h2>
              <NewsletterForm note={newsletter.note} />
            </div>
            <ul className="flex gap-2">
              {siteConfig.social.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="grid size-[2.625rem] place-items-center border border-ash text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                  >
                    <Icon name={social.network} size={19} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-graphite pt-8">
          <div className="flex flex-col-reverse gap-4 text-small font-medium tracking-[0.5px] text-line sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex gap-[3.25rem]">
              {legalNavigation.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="link-underline hover:text-stone">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p>
              © <CopyrightYear /> {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
