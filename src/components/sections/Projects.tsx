import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import projectsData from "../../data/projects.json";

type ProjectStack = { name: string; logo: string };
type Project = {
  slug: string; title: string; shortDescription: string;
  fullDescription: string; mainImage: string; gallery: string[];
  github: string | null; stacks: ProjectStack[];
};
const projects = (projectsData as { projects: Project[] }).projects;
const N = projects.length;

function clamp(v: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, v)); }

// Arc carousel constants
const ANGLE_STEP = 40 * (Math.PI / 180); // 40° between cards (radians)
const ARC_R      = 780;   // horizontal arc radius (px)
const ARC_CURVE  = 110;   // vertical bow — active card at top, sides lower

export default function Projects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [dims, setDims] = useState({
    w: typeof window !== "undefined" ? window.innerWidth  : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  const isMobile = dims.w < 768;

  useEffect(() => {
    let ticking = false;
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sec = sectionRef.current;
        if (!sec) { ticking = false; return; }
        const rect       = sec.getBoundingClientRect();
        const scrollable = sec.offsetHeight - dims.h;
        const t = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
        setProgress(t);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [dims.h]);

  // floatIdx 0 → N-1 as progress 0 → 1
  const floatIdx  = progress * (N - 1);
  const activeIdx = clamp(Math.round(floatIdx), 0, N - 1);

  const CARD_W = isMobile ? dims.w * 0.86 : Math.min(dims.w * 0.46, 580);
  const CARD_H = CARD_W;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects-section"
      style={{ height: `${(N + 2) * 100}vh` }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
        {/* Radial glow spotlight */}
        <div className="projects-glow" />

        <div className="projects-header">
          <h2 className="projects-title">Projets</h2>
          <span className="projects-count">{String(N).padStart(2, "0")} réalisations</span>
        </div>

        {/* Arc stage — perspective for 3D tilt */}
        <div style={{
          position: "absolute",
          inset: 0,
          perspective: "1400px",
          perspectiveOrigin: "50% 48%",
        }}>
          {projects.map((project, i) => {
            const lt    = i - floatIdx;
            const absLt = Math.abs(lt);

            if (absLt > 3.2) return null;

            const angle = lt * ANGLE_STEP;
            // Arc position: active card at top, sides curve downward
            const x     = ARC_R * Math.sin(angle);
            const y     = ARC_CURVE * (1 - Math.cos(angle));
            // 3D tilt towards center
            const rotY  = -lt * 16;
            // Scale: active = 1, adjacent = 0.82, next = 0.68
            const scale  = Math.max(0.36, 1 - absLt * 0.18);
            // Fade far cards
            const opacity = Math.max(0, 1 - Math.max(0, absLt - 2.4) * 1.0);
            // Depth z-index
            const zi      = 50 - Math.round(absLt * 8);
            const isActive = absLt < 0.25;

            return (
              <div
                key={project.slug}
                style={{
                  position:   "absolute",
                  left:       "50%",
                  top:        "50%",
                  width:      `${CARD_W}px`,
                  height:     `${CARD_H}px`,
                  marginLeft: `-${CARD_W / 2}px`,
                  marginTop:  `-${CARD_H / 2 - 10}px`,
                  transform:  `translateX(${x}px) translateY(${y}px) rotateY(${rotY}deg) scale(${scale})`,
                  opacity:    clamp(opacity, 0, 1),
                  zIndex:     zi,
                  willChange: "transform, opacity",
                  transition: "box-shadow 0.4s ease",
                  boxShadow:  isActive
                    ? "0 32px 100px rgba(107,72,232,0.28), 0 0 0 1px rgba(107,72,232,0.18)"
                    : "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <Link
                  to={`/project/${project.slug}`}
                  className="project-card arc-card"
                  style={{ display: "block", width: "100%", height: "100%", borderRadius: 26 }}
                  tabIndex={absLt < 0.4 ? 0 : -1}
                >
                  <div className="project-card-inner">
                    <div className="project-image-container">
                      <img
                        src={project.mainImage}
                        alt={project.title}
                        className="project-image"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                    <div className="project-overlay" />
                    <div className="project-stacks">
                      {project.stacks.slice(0, 3).map(s => (
                        <div key={s.name} className="project-stack-badge">
                          <img src={s.logo} alt={s.name} className="project-stack-logo" />
                          <span className="project-stack-name">{s.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`project-arrow${isActive ? " project-arrow-visible" : ""}`}>↗</div>
                    <div className="project-meta">
                      <h3 className="project-title-card">{project.title}</h3>
                      <p className="project-desc-card">{project.shortDescription}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Arc progress indicator */}
        <div className="projects-dots">
          {projects.map((_, i) => (
            <div key={i} className={`projects-dot${i === activeIdx ? " projects-dot--active" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
