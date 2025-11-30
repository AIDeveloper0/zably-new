export type MockProvider = {
  id: string;
  slug: string;
  name: string;
  headline?: string | null;
  summary?: string | null;
  tags: string[];
  services: string[];
  state?: string | null;
  suburb?: string | null;
  website?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  funding: string[];
  locations: { label?: string | null; suburb?: string | null; state?: string | null }[];
  servicesDetail: { name: string; summary?: string | null }[];
};

export const mockProviders: MockProvider[] = [
  {
    id: "mock-provider-1",
    slug: "sample-provider-aurora-support",
    name: "Aurora Support Collective",
    headline: "Holistic allied health + support coordination across VIC",
    summary:
      "Aurora delivers person-led therapy, coordination, and supported independent living programs focused on meaningful community participation.",
    tags: ["NDIS registered", "Multilingual team", "Community specialists"],
    services: ["Therapy & Allied Health", "Support Coordination"],
    state: "VIC",
    suburb: "Melbourne",
    website: "https://aurora-support.example.com.au",
    contactEmail: "hello@aurorasupport.com.au",
    contactPhone: "1300 555 210",
    funding: ["NDIS", "Private"],
    locations: [
      { label: "Melbourne HQ", state: "VIC", suburb: "Melbourne" },
      { label: "Geelong Clinic", state: "VIC", suburb: "Geelong" },
    ],
    servicesDetail: [
      {
        name: "Therapy & Allied Health",
        summary: "OT, speech, and behaviour support provided in-home or online.",
      },
      {
        name: "Support Coordination",
        summary: "Level 2 coordination to help you action and review your plan.",
      },
    ],
  },
  {
    id: "mock-provider-2",
    slug: "sample-provider-coastal-care",
    name: "Coastal Care Partners",
    headline: "Community access + SDA partners for NSW and QLD participants",
    summary:
      "Regional-first workforce delivering travel training, short-term accommodation, and SIL partnerships with rigorous safeguarding.",
    tags: ["Regional outreach", "SDA partners", "24/7 support"],
    services: ["Community Access", "Supported Independent Living"],
    state: "NSW",
    suburb: "Newcastle",
    website: "https://coastalcare.example.com.au",
    contactEmail: "enquiries@coastalcare.com.au",
    contactPhone: "1300 888 032",
    funding: ["NDIS", "My Aged Care"],
    locations: [
      { label: "Newcastle Hub", state: "NSW", suburb: "Newcastle" },
      { label: "Gold Coast Hub", state: "QLD", suburb: "Southport" },
    ],
    servicesDetail: [
      {
        name: "Supported Independent Living",
        summary: "Rostered teams supporting SDA residents with community links.",
      },
      {
        name: "Community Access",
        summary:
          "Travel training, day programs, and tailored social participation.",
      },
    ],
  },
  {
    id: "mock-provider-3",
    slug: "sample-provider-planwise",
    name: "Planwise Managers",
    headline: "Fast plan management with real-time claim visibility",
    summary:
      "Sydney-based credentialed accountants processing NDIS claims within 2 business days, with multilingual liaisons.",
    tags: ["Plan management", "Multilingual team", "Audit ready"],
    services: ["Plan Management"],
    state: "NSW",
    suburb: "Sydney",
    website: "https://planwise.example.com.au",
    contactEmail: "support@planwise.com.au",
    contactPhone: "02 9555 1000",
    funding: ["NDIS"],
    locations: [{ label: "Sydney Office", state: "NSW", suburb: "CBD" }],
    servicesDetail: [
      {
        name: "Plan Management",
        summary: "Claim processing, budget dashboards, and provider compliance.",
      },
    ],
  },
];

export const mockDirectoryFilters = {
  categories: [
    { slug: "therapy-allied", name: "Therapy & Allied Health" },
    { slug: "community-access", name: "Community Access" },
    { slug: "support-coordination", name: "Support Coordination" },
    { slug: "supported-independent-living", name: "Supported Independent Living" },
    { slug: "plan-management", name: "Plan Management" },
  ],
  funding: [
    { slug: "ndis", label: "NDIS" },
    { slug: "private", label: "Private" },
    { slug: "my-aged-care", label: "My Aged Care" },
  ],
  states: ["NSW", "QLD", "VIC"],
};

export function getMockProviders() {
  return mockProviders;
}

export function getMockProvider(slug: string) {
  return mockProviders.find((provider) => provider.slug === slug) ?? null;
}

export function filterMockProviderSummaries({
  query,
  states,
  categories,
  funding,
}: {
  query?: string;
  states?: string[];
  categories?: string[];
  funding?: string[];
}) {
  const normalizedQuery = query?.toLowerCase().trim();
  return mockProviders.filter((provider) => {
    const matchesQuery = normalizedQuery
      ? provider.name.toLowerCase().includes(normalizedQuery) ||
        provider.summary?.toLowerCase().includes(normalizedQuery)
      : true;

    const matchesState =
      !states?.length ||
      (provider.state && states.includes(provider.state.toUpperCase()));

    const matchesFunding =
      !funding?.length ||
      funding.some((item) =>
        provider.funding.map((fund) => fund.toLowerCase()).includes(item.toLowerCase())
      );

    const matchesCategory =
      !categories?.length ||
      categories.some((category) =>
        provider.services
          .map((service) => service.toLowerCase())
          .some((service) => service.includes(category.replace(/-/g, " ")))
      );

    return matchesQuery && matchesState && matchesFunding && matchesCategory;
  });
}
