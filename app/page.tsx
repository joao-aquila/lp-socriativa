import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { ProjectShowcase, ProjectShowcaseSkeleton } from "@/components/ProjectShowcase";
import { Process } from "@/components/Process";
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

export const dynamic = "force-dynamic";

const showcase = {
  id: "projetos",
  title: "projetos entregues",
  subtitle: "um pouquinho do que já saiu daqui",
};

/** Única parte da home que depende do D1. */
async function FeaturedProjects() {
  const [conteudo, identidade] = await Promise.all([
    getFeatured("conteudo"),
    getFeatured("identidade"),
  ]);

  return (
    <ProjectShowcase
      {...showcase}
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
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema, websiteSchema, faqSchema]} />
      <SiteHeader />
      <main id="conteudo-principal">
        <Hero />
        <Manifesto />
        <Services />
        {/* o topo da página sai na hora, sem esperar a consulta ao D1; os
            projetos chegam em seguida, no mesmo response (streaming) */}
        <Suspense
          fallback={
            <ProjectShowcaseSkeleton {...showcase} aspects={["portrait", "landscape"]} />
          }
        >
          <FeaturedProjects />
        </Suspense>
        <Process />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
