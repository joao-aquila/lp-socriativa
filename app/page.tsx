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
        <div id="projetos" className="scroll-mt-24">
          <ProjectShowcase
            title="conteúdos entregues"
            subtitle="um pouquinho do que já saiu daqui"
            projects={conteudo}
            category="conteudo"
            ctaLabel="ver todos os projetos de conteúdo"
          />
          <ProjectShowcase
            title="projetos entregues"
            subtitle="identidades visuais que já ganharam o mundo"
            projects={identidade}
            category="identidade"
            ctaLabel="ver todos os projetos de idv"
          />
        </div>
        <Process />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
