import { site, siteUrl } from "./site";
import { faq } from "./faq";
import type { Project } from "./types";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: siteUrl,
  description: site.description,
  email: site.email,
  image: `${siteUrl}/opengraph-image`,
  sameAs: [site.instagram],
  areaServed: { "@type": "Country", name: "Brasil" },
  knowsLanguage: "pt-BR",
  serviceType: [
    "Criação de conteúdo para redes sociais",
    "Identidade visual",
    "Design gráfico digital",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços da Sô Criativa",
    itemListElement: [
      "criação de conteúdo",
      "identidade visual",
      "criação de design",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: site.name,
  inLanguage: "pt-BR",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export const projectSchema = (project: Project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": `${siteUrl}/projetos/${project.slug}`,
  name: project.title,
  headline: project.title,
  description: project.description ?? site.description,
  inLanguage: "pt-BR",
  url: `${siteUrl}/projetos/${project.slug}`,
  about: project.client,
  creator: { "@id": `${siteUrl}/#organization` },
  ...(project.image ? { image: `${siteUrl}${project.image}` } : {}),
  ...(project.publishedAt ? { datePublished: project.publishedAt } : {}),
});

export const breadcrumbSchema = (
  items: { name: string; url: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.url}`,
  })),
});
