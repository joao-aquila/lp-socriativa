export type ProjectCategory = "conteudo" | "identidade" | "design";

export type Project = {
  /** identificador estável, usado na URL: /projetos/[slug] */
  slug: string;
  /** título curto do projeto — ex.: "quem é a natália fora da versão psicóloga?" */
  title: string;
  /** nicho/cliente — ex.: "psicologia", "dentista dra. julia fernandes" */
  client: string;
  category: ProjectCategory;
  /** caminho em /public ou URL absoluta. Vazio => placeholder é renderizado */
  image?: string;
  /** proporção da mídia no card */
  aspect?: "portrait" | "landscape" | "square";
  /** descrição usada na página do projeto e no SEO */
  description?: string;
  /** link externo (post no Instagram, behance, etc.) */
  href?: string;
  /** ordem de exibição (menor primeiro) */
  order?: number;
  /** destaque na home */
  featured?: boolean;
  publishedAt?: string;
};
