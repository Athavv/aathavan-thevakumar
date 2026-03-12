import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import projectsData from "../data/projects.json";
import Header from "../components/layouts/Header.tsx";
import Contact from "../components/sections/Contact.tsx";

type ProjectStack = {
  name: string;
  logo: string;
};

type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  gallery: string[];
  github: string | null;
  stacks: ProjectStack[];
};

type ProjectsData = {
  projects: Project[];
};

export default function ProjectsPage() {
  const typedData = projectsData as ProjectsData;
  const projects = typedData.projects || [];

  const allStacks = useMemo(() => {
    const names = new Set<string>();
    projects.forEach((p) => p.stacks.forEach((s) => names.add(s.name)));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const [stackFilter, setStackFilter] = useState<string>("");
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () =>
      projects.filter((p) =>
        !stackFilter ? true : p.stacks.some((s) => s.name === stackFilter),
      ),
    [projects, stackFilter],
  );

  useLayoutEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll<HTMLElement>(".project-page-card");
      if (!cards.length) return;

      gsap.from(cards, {
        y: 40,
        rotate: (i) => (i % 2 === 0 ? -2 : 2),
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, cardsRef);

    return () => ctx.revert();
  }, [filtered.length]);

  return (
    <>
      <Header />
      <main className="min-h-screen px-[clamp(24px,6vw,64px)] pt-28 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Sélection de projets
            </p>
            <h1 className="mt-3 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-neutral-900">
              Mes projets.
            </h1>
            <p className="mt-4 text-[0.98rem] text-neutral-600 font-body max-w-[70ch]">
              Une sélection de projets académiques et personnels. Filtre par
              techno, puis ouvre la fiche détaillée pour voir la description
              complète et la galerie d’images.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-12 items-start">
            <div className="flex-1 rounded-3xl border border-neutral-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur px-5 py-4">
              <p className="text-sm text-neutral-500 font-medium mb-1">
                Vue d’ensemble
              </p>
              <p className="text-sm text-neutral-600">
                Cartes flottantes, interactions douces et focus sur le contenu.
              </p>
            </div>

            <div className="w-full md:w-[260px] rounded-3xl border border-neutral-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur px-5 py-4">
              <label className="block text-neutral-700 font-body text-sm mb-2">
                Filtrer par stack
              </label>
              <select
                value={stackFilter}
                onChange={(e) => setStackFilter(e.target.value)}
                className="w-full rounded-2xl bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition"
              >
                <option value="">Toutes</option>
                {allStacks.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8"
          >
            {filtered.map((project, index) => (
              <article
                key={project.slug}
                className="project-page-card group relative rounded-[28px] border border-neutral-200/70 bg-white/90 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-md overflow-hidden transition-transform duration-500 will-change-transform hover:-translate-y-3 hover:-rotate-1 hover:shadow-[0_26px_80px_rgba(15,23,42,0.16)]"
                style={{
                  transformOrigin: index % 2 === 0 ? "left center" : "right center",
                }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(15,23,42,0.05),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.08),transparent_55%)] pointer-events-none" />
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.06]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                  <div className="absolute left-5 right-5 bottom-4 flex flex-col gap-2">
                    <h2 className="font-display text-[1.6rem] leading-tight tracking-tight text-neutral-900">
                      {project.title}
                    </h2>
                    <p className="text-sm text-neutral-600 font-body line-clamp-2">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="relative p-5 md:p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stacks.map((s) => (
                      <span
                        key={s.name}
                        className="text-[0.7rem] uppercase tracking-[0.16em] text-neutral-700 border border-neutral-200 bg-neutral-50 rounded-full px-3 py-1"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/project/${project.slug}`}
                      className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border border-neutral-900/90 bg-neutral-900 text-white transition-colors duration-200 hover:bg-neutral-800"
                    >
                      Voir le projet
                    </Link>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border border-neutral-300 bg-white text-neutral-800 transition-colors duration-200 hover:bg-neutral-50"
                      >
                        GitHub
                      </a>
                    )}

                    <div className="ml-auto text-[0.72rem] font-mono uppercase tracking-[0.22em] text-neutral-400">
                      #{project.slug}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 rounded-3xl border border-neutral-200 bg-white/80 px-6 py-8 text-neutral-600">
              Aucun projet ne correspond au filtre sélectionné.
            </div>
          )}
        </div>
      </main>
      <Contact />
    </>
  );
}
