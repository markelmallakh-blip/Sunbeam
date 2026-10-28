import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { contactPage } from "@/content/contact";
import { ContactForm } from "@/components/contact/ContactForm";
import { CalEmbed } from "@/components/booking/CalEmbed";
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
 * Contact page: a grey panel with the page heading at the top and our contact details and
 * socials at the bottom, beside the inquiry form, then the Cal.com booking embed for anyone who
 * would rather talk.
 */
export default function ContactPage() {
  const { email, address } = siteConfig.contact;

  return (
    <>
      <section
        aria-labelledby="contact-title"
        className="flex flex-col items-center gap-stack px-edge py-block"
      >
        <div className="grid w-full max-w-[80rem] gap-2 lg:grid-cols-[30rem_1fr]">
          {/* Grey panel: the page heading at the top, our contact details at the bottom. */}
          <aside className="flex flex-col gap-12 rounded-[4px] bg-mist p-8 lg:p-10">
            <header className="flex flex-col gap-3">
              <p className="text-eyebrow-lg font-medium tracking-[0.5px] text-slate uppercase">
                {contactPage.eyebrow}
              </p>
              <h1 id="contact-title" className="text-heading-3 font-semibold text-ink">
                {contactPage.title}
              </h1>
              <p className="text-body tracking-[0.5px] text-slate">{contactPage.intro}</p>
            </header>

            <section aria-labelledby="studio-title" className="mt-auto flex flex-col gap-6">
              <h2 id="studio-title" className="text-heading-6 font-semibold text-ink">
                {contactPage.details.title}
              </h2>
              <ul className="flex flex-col gap-5 text-body tracking-[0.5px] text-ink">
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
                  <address className="not-italic lg:whitespace-nowrap">{address}</address>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="clock" size={20} className="mt-0.5 shrink-0" />
                  <span className="lg:whitespace-nowrap">{contactPage.details.hours}</span>
                </li>
              </ul>
              <ul className="flex gap-2">
                {siteConfig.social.map((social) => (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="grid size-[2.625rem] place-items-center rounded-[4px] border border-ash text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
                    >
                      <Icon name={social.network} size={19} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <div className="flex flex-col gap-6 rounded-[4px] border border-hairline p-6 sm:p-8">
            <h2 className="text-heading-6 font-semibold text-ink">{contactPage.form.title}</h2>
            <ContactForm />
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
        <div className="w-full max-w-[55.625rem] overflow-hidden rounded-xl border border-hairline bg-white">
          <CalEmbed />
        </div>
      </section>
    </>
  );
}
