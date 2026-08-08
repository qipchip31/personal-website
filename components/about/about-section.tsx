import { siteConfig } from "@/config/site";
import { aboutBio, type SocialLinkLabel } from "@/content/about/bio";
import { currentItems } from "@/content/about/current";
import { ContactForm } from "@/components/about/contact-form";

const socialLinks = {
  github: {
    href: siteConfig.github,
    text: siteConfig.socialHandles.github,
  },
  linkedin: {
    href: siteConfig.linkedin,
    text: siteConfig.socialHandles.linkedin,
  },
  instagram: {
    href: siteConfig.instagram,
    text: siteConfig.socialHandles.instagram,
  },
  "twitter/x": {
    href: siteConfig.twitter,
    text: siteConfig.socialHandles.twitter,
  },
  email: {
    href: `mailto:${siteConfig.email}`,
    text: siteConfig.email,
  },
} satisfies Record<SocialLinkLabel, { href: string; text: string }>;

export function AboutSection() {
  return (
    <article className="about-page">
      <header className="about-hero">
        <p>{aboutBio.hello}</p>
      </header>

      <div className="about-copy">
        {aboutBio.introduction.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="about-section" aria-labelledby="about-currently">
        <h2 id="about-currently">{aboutBio.sections.currently}</h2>
        <dl className="about-current">
          {currentItems.map((item) => (
            <div className="about-current__item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="about-section" aria-labelledby="about-find-me">
        <h2 id="about-find-me">{aboutBio.sections.findMe}</h2>
        <ul className="about-links">
          {aboutBio.socialLabels.map((label) => (
            <li key={label}>
              <a href={socialLinks[label].href}>{label}</a>
              <span>{socialLinks[label].text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section" aria-labelledby="about-say-hello">
        <h2 id="about-say-hello">{aboutBio.sections.sayHello}</h2>
        <ContactForm />
      </section>
    </article>
  );
}
