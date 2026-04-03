import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "../../data/projects.json";

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

const projects = (projectsData as { projects: Project[] }).projects;

function useWindowSize() {
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    const handle = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { w, h } = useWindowSize();

  const isMobile = w < 768;
  const CARD_W = isMobile ? w * 0.82 : Math.min(w * 0.42, h * 0.82);
  const GAP = isMobile ? 20 : 32;
  const PADDING = isMobile ? 24 : Math.max(24, w * 0.06);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalTrackWidth =
      projects.length * CARD_W + (projects.length - 1) * GAP;
    const scrollDistance = totalTrackWidth - w + PADDING * 2;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance + h * 0.5}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [w, h, CARD_W, GAP, PADDING]);

  return (
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="projects-glow" />

      <div className="projects-header">
        <h2 className="projects-title">Projets</h2>
        <span className="projects-count">
          {String(projects.length).padStart(2, "0")} réalisations
        </span>
      </div>

      <div className="projects-sticky">
        <div className="projects-viewport">
          <div
            ref={trackRef}
            className="projects-track"
            style={{
              gap: `${GAP}px`,
              paddingLeft: `${PADDING}px`,
              paddingRight: `${PADDING}px`,
            }}
          >
            {projects.map((project, index) => {
              const normalizedIndex = index / (projects.length - 1) - 0.5;
              const baseRotate = normalizedIndex * 6;
              const baseY = Math.abs(normalizedIndex) * (isMobile ? 0 : 60);

              return (
                <Link
                  key={project.slug}
                  to={`/project/${project.slug}`}
                  className="project-card"
                  style={{
                    width: `${CARD_W}px`,
                    height: `${isMobile ? CARD_W * 1.2 : Math.min(CARD_W * 1.15, h * 0.72)}px`,
                    transform: `translateY(${baseY}px) rotate(${baseRotate}deg)`,
                    flexShrink: 0,
                  }}
                >
                  <div className="project-card-inner">
                    <div className="project-image-container">
                      <img
                        src={project.mainImage}
                        alt={project.title}
                        className="project-image"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    </div>

                    <div className="project-overlay" />

                    <div className="project-stacks">
                      {project.stacks.slice(0, 3).map((stack) => (
                        <div key={stack.name} className="project-stack-badge">
                          <img
                            src={stack.logo}
                            alt={stack.name}
                            className="project-stack-logo"
                          />
                          <span className="project-stack-name">
                            {stack.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="project-arrow">↗</div>

                    <div className="project-meta">
                      <h3 className="project-title-card">{project.title}</h3>
                      <p className="project-desc-card">
                        {project.shortDescription}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
