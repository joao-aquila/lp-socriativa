export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://socriativaestudio.com.br"
).replace(/\/$/, "");

export const site = {
  name: "Sô Criativa",
  legalName: "Sô Criativa — Estúdio Criativo",
  url: siteUrl,
  locale: "pt_BR",
  tagline: "estúdio criativo feito para marcas pessoais",
  description:
    "Estúdio criativo de social media para marcas pessoais: criação de conteúdo, identidade visual e design para psicólogos, dentistas, advogados e outros profissionais liberais.",
  keywords: [
    "estúdio criativo",
    "social media",
    "marca pessoal",
    "identidade visual",
    "criação de conteúdo",
    "gestão de redes sociais",
    "design para psicólogos",
    "design para dentistas",
    "branding para profissionais liberais",
    "rebranding",
  ],
  email: "am.mellomantovani@gmail.com",
  whatsapp: "5518996170022",
  instagram: "https://instagram.com/socriativaestudio",
  areaServed: "BR",
} as const;

export const whatsappUrl = (message = "oi! vim pelo site e quero tirar uma ideia do papel ✨") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
