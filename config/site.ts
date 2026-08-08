export type NavigationItem = {
  label: string;
  href: `/${string}`;
};

export type SeoMetadata = {
  title: string;
  description: string;
  url: string;
  image: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  socialHandles: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  navigation: NavigationItem[];
  seo: SeoMetadata;
  footer: {
    text: string;
    links: FooterLink[];
  };
};

export const siteConfig = {
  name: "chirag pradhan",
  tagline: "software engineer, product builder, ai enthusiast",
  description:
    "i build ai products, developer tools, and secure systems from bengaluru, india.",
  email: "qipchip31@gmail.com",
  github: "https://github.com/qipchip31",
  linkedin: "https://linkedin.com/in/qipchip",
  twitter: "https://twitter.com/qipchip",
  instagram: "https://instagram.com/qip.chip",
  socialHandles: {
    github: "qipchip31",
    linkedin: "qipchip",
    twitter: "qipchip",
    instagram: "qip.chip",
  },
  navigation: [
    { label: "about", href: "/about" },
    { label: "work", href: "/work" },
    { label: "research", href: "/research" },
    { label: "writing", href: "/blogs" },
    { label: "play", href: "/play" },
  ],
  seo: {
    title: "chirag pradhan",
    description:
      "personal website of chirag pradhan, software engineer and product builder.",
    url: "https://qipchip.com",
    image: "/images/og.svg",
  },
  footer: {
    text: "built and maintained by chirag pradhan",
    links: [
      { label: "github", href: "https://github.com/qipchip" },
      { label: "email", href: "mailto:qipchip31@gmail.com" },
    ],
  },
} satisfies SiteConfig;
