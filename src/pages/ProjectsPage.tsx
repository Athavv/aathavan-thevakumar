import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import projectsData from "../data/projects.json";
import Header from "../components/layouts/Header.tsx";
import Contact from "../components/sections/Contact.tsx";

type ProjectStack = { name: string; logo: string };
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

const allProjects = (projectsData as { projects: Project[] }).projects;

export default function ProjectsPage() {
  const allStacks = useMemo(() => {
    const names = new Set<string>();
    allProjects.forEach((p) => p.stacks.forEach((s) => names.add(s.name)));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, []);

  const [stackFilter, setStackFilter] = useState("");
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () => allProjects.filter((p) => !stackFilter || p.stacks.some((s) => s.name === stackFilter)),
    [stackFilter],
  );

  useLayoutEffect(() => {
    const container = cardsRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll<HTMLElement>(".pp-card");
      if (!cards.length) return;
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, cardsRef);
    return () => ctx.revert();
  }, [filtered.length]);

  return (
    <>
      <Header />

      <main className="pp-main">
        {/* Page header */}
        <div className="pp-page-header">
          <p className="pp-eyebrow">Sélection de projets</p>
          <h1 className="pp-heading">Mes projets.</h1>
          <p className="pp-lead">
            Projets académiques et personnels — filtre par techno pour naviguer la liste.
          </p>
        </div>

        {/* Filter bar */}
        <div className="pp-filter-bar">
          <div className="pp-filter-info">
            <span className="pp-filter-count">
              {String(filtered.length).padStart(2, "0")}
            </span>
            <span className="pp-filter-label">réalisations</span>
          </div>

          <div className="pp-filter-select-wrap">
            <label className="pp-filter-select-label">Stack :</label>
            <select
              value={stackFilter}
              onChange={(e) => setStackFilter(e.target.value)}
              className="pp-filter-select"
            >
              <option value="">Toutes</option>
              {allStacks.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards grid */}
        <div ref={cardsRef} className="pp-grid">
          {filtered.map((project, index) => (
            <article
              key={project.slug}
              className="pp-card"
              style={{ "--card-index": index } as React.CSSProperties}
            >
              <div className="pp-card-image">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="pp-card-img"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="pp-card-image-overlay" />
                <div className="pp-card-index">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="pp-card-body">
                <div className="pp-card-stacks">
                  {project.stacks.map((s) => (
                    <span key={s.name} className="pp-stack-tag">{s.name}</span>
                  ))}
                </div>

                <h2 className="pp-card-title">{project.title}</h2>
                <p className="pp-card-desc">{project.shortDescription}</p>

                <div className="pp-card-actions">
                  <Link to={`/project/${project.slug}`} className="pp-btn-primary">
                    Voir le projet ↗
                  </Link>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pp-btn-ghost"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="pp-empty">Aucun projet pour ce filtre.</p>
        )}
      </main>

      <Contact />
    </>
  );
}
