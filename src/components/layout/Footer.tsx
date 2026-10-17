import Link from "next/link";
import { footerNavigation, legalNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { newsletter } from "@/content/home";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { RollText } from "@/components/ui/RollText";
import { Container } from "./Container";
import { CopyrightYear } from "./CopyrightYear";
import { FooterMotion } from "./FooterMotion";

/* Figma "Footer": newsletter and contact, link columns, legal row and the bleeding wordmark. */
export function Footer() {
  return (
    <FooterMotion className="overflow-hidden bg-white pt-[4.6rem] text-ink">
      <Container>
        <div
          id="newsletter"
          className="flex scroll-mt-header flex-col justify-between gap-10 lg:flex-row"
        >
          <div data-footer-item className="flex flex-col gap-5">
            <h2 className="max-w-[25rem] font-display text-quote leading-[1.3]">
              {newsletter.title}
            </h2>
            <NewsletterForm />
          </div>

          <div data-footer-item className="flex flex-col gap-6 lg:items-end">
            <address className="flex flex-col gap-3 text-small not-italic sm:flex-row sm:gap-6">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-2 hover:text-rust"
              >
                <Icon name="mail" size={18} />
                {siteConfig.contact.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <Icon name="location" size={18} />
                {siteConfig.contact.address}
              </span>
            </address>
            <ul className="flex gap-2 lg:mr-auto lg:ml-0 lg:self-start">
              {siteConfig.social.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="grid size-[3.25rem] place-items-center border border-line/60 text-slate transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
                  >
                    <Icon name={social.network} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="mt-11 grid grid-cols-2 gap-10 border-y border-rule py-12 md:flex md:justify-between"
        >
          {footerNavigation.map((column) => (
            <div key={column.title} data-footer-item className="flex flex-col gap-4">
              <h3 className="text-body text-slate">{column.title}</h3>
              <ul className="flex flex-col gap-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group/roll text-subtitle">
                      <RollText>{link.label}</RollText>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div
          data-footer-item
          className="relative z-10 flex flex-col-reverse gap-4 pt-10 text-small sm:flex-row sm:items-center sm:justify-between"
        >
          <ul className="flex gap-10">
            {legalNavigation.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="group/roll">
                  <RollText>{link.label}</RollText>
                </Link>
              </li>
            ))}
          </ul>
          <p>
            © <CopyrightYear /> {siteConfig.name}. All rights reserved.
          </p>
        </div>

        {/* The wordmark bleeds off the bottom of the page, as in the Figma footer. */}
        <div data-footer-logo className="-mt-3 aspect-[1398/439] overflow-hidden">
          <Logo decorative className="h-auto w-full" />
        </div>
      </Container>
    </FooterMotion>
  );
}
