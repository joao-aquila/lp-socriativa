import Link from "next/link";
import { MediaFrame } from "./MediaFrame";
import { publicAsset } from "@/lib/media";
import { categoryLabel } from "@/lib/projects";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  priority = false,
  aspect,
}: {
  project: Project;
  priority?: boolean;
  /** força uma proporção única — usado nas grades mistas, para alinhar os cards */
  aspect?: Project["aspect"];
}) {
  const src = publicAsset(project.image);

  return (
    <article className="group relative overflow-hidden rounded-card bg-ink">
      <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-4 py-1.5 text-sm font-bold text-paper">
        {categoryLabel[project.category]}
      </span>

      <MediaFrame
        src={src}
        alt={`${project.title} — projeto de ${categoryLabel[project.category]} para ${project.client}`}
        aspect={aspect ?? project.aspect ?? "portrait"}
        fallbackLabel="arte em breve"
        priority={priority}
        className="rounded-card"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold text-paper">{project.client}</h3>
        <p className="mt-1 text-lg text-paper/80">
          <Link
            href={`/projetos/${project.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </p>
      </div>
    </article>
  );
}
