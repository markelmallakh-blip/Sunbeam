import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { contactPage } from "@/content/contact";
import { ContactForm } from "@/components/contact/ContactForm";
import { CalEmbed } from "@/components/booking/CalEmbed";
import { PageIntro } from "@/components/services/PageIntro";
import { StudioMap } from "@/components/contact/StudioMap";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Contact Us",
  description: contactPage.intro,
  alternates: { canonical: withBase("/contact") },
  openGraph: {
    url: withBase("/contact"),
    title: "Contact Sunbeam Spaces",
    description: contactPage.intro,
  },
};

/*
 * Contact page: the page heading over the inquiry form; then "Reach Sunbeam", a map pinned on the
 * studio with every contact detail (email, address, hours and directions) in a card on
 * its right, clear of the map's "Open in Maps" link; then the Cal.com booking embed for anyone
 * who would rather talk. Form, map and booking share one 1280px width so the page lines up.
 */
export default function ContactPage() {
  const { email, address } = siteConfig.contact;

  return (
    <>
      <section
        aria-labelledby="contact-title"
        className="flex flex-col items-center gap-stack px-edge py-block"
      >
        <PageIntro
          id="contact-title"
          eyebrow={contactPage.eyebrow}
          title={contactPage.title}
          intro={contactPage.intro}
        />
        <div className="flex w-full max-w-[80rem] flex-col gap-5 rounded-[4px] border border-hairline p-5 sm:gap-6 sm:p-8">
          <h2 className="text-heading-6 font-semibold text-ink">{contactPage.form.title}</h2>
          <ContactForm />
        </div>
      </section>

      <section aria-labelledby="reach-title" className="px-edge pb-block">
        <div className="relative mx-auto w-full max-w-[80rem] overflow-hidden rounded-[4px] bg-mist">
          <StudioMap
            title={`Map showing Sunbeam Spaces at ${address}`}
            mapsHref={siteConfig.contact.directions}
          />
          <div className="flex flex-col gap-5 bg-white p-5 sm:absolute sm:top-1/2 sm:right-6 sm:z-[500] sm:w-[24rem] sm:-translate-y-1/2 sm:rounded-[4px] sm:p-7 sm:shadow-[0_8px_30px_rgb(0_0_0/0.12)]">
            <div className="flex flex-col gap-1.5">
              <p className="text-small font-medium tracking-[1px] text-slate uppercase">
                {contactPage.reach.eyebrow}
              </p>
              <h2 id="reach-title" className="text-heading-4 font-semibold text-ink">
                {contactPage.reach.title}
              </h2>
            </div>
            <ul className="flex flex-col gap-3 text-small tracking-[0.5px] text-ink sm:gap-4 sm:text-body">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="link-underline inline-flex items-center gap-2"
                >
                  <Icon name="mail" size={20} className="shrink-0" />
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="location" size={20} className="mt-0.5 shrink-0" />
                <address className="not-italic">{address}</address>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="clock" size={20} className="mt-0.5 shrink-0" />
                <span>{contactPage.details.hours}</span>
              </li>
            </ul>
            <Button
              href={siteConfig.contact.directions}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-dark"
              className="self-start"
            >
              {contactPage.reach.directions}
            </Button>
          </div>
        </div>
      </section>

      <section
        id="book"
        aria-labelledby="book-title"
        className="flex scroll-mt-header flex-col items-center gap-stack bg-linen px-edge py-block"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-slate uppercase">
            {contactPage.booking.eyebrow}
          </p>
          <h2 id="book-title" className="text-heading-3 font-semibold text-ink">
            {contactPage.booking.title}
          </h2>
          <p className="max-w-[34rem] text-body tracking-[0.5px] text-slate">
            {contactPage.booking.description}
          </p>
        </div>
        <div className="w-full max-w-[80rem] overflow-hidden rounded-[4px] border border-hairline bg-white">
          <CalEmbed />
        </div>
      </section>
    </>
  );
}
