export const siteConfig = {
  name: "Zably",
  tagline: "Australia's disability services directory",
  description:
    "Search and compare verified disability service providers across Australia. Filter by funding type, service category, and state to find the right support faster.",
  url: "https://zably.com.au",
  keywords: [
    "disability services directory",
    "NDIS providers",
    "Allied health Australia",
    "support coordination",
    "disability marketplace",
  ],
  contactEmail: "hello@zably.com.au",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Search providers", href: "/providers" },
    { label: "Articles", href: "/articles" },
  ],
  social: {
    linkedin: "https://www.linkedin.com/company/zably",
  },
};

export type SiteConfig = typeof siteConfig;
