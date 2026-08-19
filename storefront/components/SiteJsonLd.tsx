import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, CONTACT, SOCIAL } from "@/lib/site";

// Organization + WebSite structured data, rendered once site-wide. Helps Google
// show the brand name, logo, social profiles, and a search box for the site.
export function SiteJsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      email: CONTACT.email,
      logo: `${SITE_URL}/icon.svg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Colombo",
        addressCountry: "LK",
      },
      sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.x, SOCIAL.tiktok, SOCIAL.youtube],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
