export type ProjectCategory = "conteudo" | "identidade" | "design";

export type ProjectAspect = "portrait" | "landscape" | "square";

export type Project = {
  id: number;
  /** identificador estável, usado na URL: /projetos/[slug] */
  slug: string;
  /** título curto do projeto — ex.: "quem é a natália fora da versão psicóloga?" */
  title: string;
  /** nicho/cliente — ex.: "psicologia", "dentista dra. julia fernandes" */
  client: string;
  category: ProjectCategory;
  /** chave do objeto no R2 */
  imageKey?: string;
  /** URL pública da arte. Vazio => placeholder é renderizado */
  image?: string;
  /** proporção da mídia no card */
  aspect: ProjectAspect;
  /** descrição usada na página do projeto e no SEO */
  description?: string;
  /** link externo (post no Instagram, behance, etc.) */
  href?: string;
  /** ordem de exibição dentro da categoria (menor primeiro) */
  position: number;
  /** destaque na home */
  featured: boolean;
  /** visível no site; oculto continua só no painel */
  active: boolean;
  publishedAt?: string;
};
