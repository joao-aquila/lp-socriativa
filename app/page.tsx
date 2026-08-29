import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { FinalCta } from "@/components/FinalCta";
import { Faq } from "@/components/Faq";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { getFeatured } from "@/lib/projects";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [conteudo, identidade] = await Promise.all([
    getFeatured("conteudo"),
    getFeatured("identidade"),
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema, websiteSchema, faqSchema]} />
      <SiteHeader />
      <main id="conteudo-principal">
        <Hero />
        <Manifesto />
        <Services />
        <ProjectShowcase
          id="projetos"
          title="projetos entregues"
          subtitle="um pouquinho do que já saiu daqui"
          rows={[
            {
              label: "conteúdos entregues",
              projects: conteudo,
              cardAspect: "portrait",
              ctaHref: "/projetos#conteudo",
              ctaLabel: "veja mais conteúdos",
              emptyLabel: "novos conteúdos chegando por aqui",
            },
            {
              label: "identidades visuais entregues",
              projects: identidade,
              cardAspect: "landscape",
              ctaHref: "/projetos#identidade",
              ctaLabel: "veja mais identidades",
              emptyLabel: "novas identidades chegando por aqui",
            },
          ]}
        />
        <Process />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
