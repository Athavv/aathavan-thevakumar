import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "../data/projects.json";
import "../style/_projectDetail.css";
import Header from "../components/layouts/Header.tsx";
import Contact from "../components/sections/Contact.tsx";

gsap.registerPlugin(ScrollTrigger);

type ProjectStack = { name: string; logo: string };
type Project = {
  slug: string; title: string; shortDescription: string;
  fullDescription: string; mainImage: string; gallery: string[];
  github: string | null; stacks: ProjectStack[];
};

const allProjects = (projectsData as { projects: Project[] }).projects;

export default function ProjectDetail() {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const pageRef     = useRef<HTMLDivElement>(null);
  const heroRef     = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const imgRef      = useRef<HTMLDivElement>(null);
  const descRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = allProjects.find(p => p.slug === slug) ?? null;
    setProject(found);
    setLoading(false);
  }, [slug]);

  // Animate in once project is loaded
  useLayoutEffect(() => {
    if (!project || !pageRef.current) return;

    const ctx = gsap.context(() => {
      // Title letters stagger
      const title = titleRef.current;
      if (title) {
        const chars = title.querySelectorAll<HTMLElement>(".pd-char");
        gsap.from(chars, {
          y: "110%", rotate: 4, opacity: 0,
          duration: 0.75, stagger: 0.022, ease: "expo.out", delay: 0.1,
        });
      }

      // Hero meta block
      gsap.from(".pd-hero-meta", {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.35,
      });

      // Main image parallax on scroll
      if (imgRef.current) {
        gsap.to(imgRef.current.querySelector("img"), {
          y: 60,
          ease: "none",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Description + gallery reveal
      gsap.from(".pd-desc-block", {
        y: 50, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".pd-desc-block", start: "top 80%", toggleActions: "play none none none" },
      });

      gsap.from(".pd-gallery-item", {
        y: 60, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: ".pd-gallery", start: "top 85%", toggleActions: "play none none none" },
      });

      // Next project reveal
      gsap.from(".pd-next", {
        y: 40, opacity: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".pd-next", start: "top 88%", toggleActions: "play none none none" },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [project]);

  // Scroll-based image scale in hero
  useEffect(() => {
    if (!heroRef.current) return;
    const onScroll = () => {
      const t = Math.min(1, window.scrollY / window.innerHeight);
      if (heroRef.current) {
        heroRef.current.style.setProperty("--hero-t", String(t));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return (
    <>
      <Header />
      <div className="pd-loading">
        <span className="pd-loading-text">Chargement...</span>
      </div>
    </>
  );

  if (!project) return (
    <>
      <Header />
      <div className="pd-loading">
        <h1 className="pd-not-found">Projet introuvable</h1>
        <button onClick={() => navigate(-1)} className="pd-back-btn">← Retour</button>
      </div>
    </>
  );

  const currentIdx = allProjects.findIndex(p => p.slug === project.slug);
  const nextProject = allProjects[(currentIdx + 1) % allProjects.length];

  // Split title into individual characters for animation
  const titleChars = project.title.split("").map((ch, i) => (
    <span key={i} className="pd-char" style={{ display: "inline-block", overflow: "hidden", lineHeight: 1 }}>
      <span className="pd-char" style={{ display: "inline-block" }}>{ch === " " ? "\u00A0" : ch}</span>
    </span>
  ));

  return (
    <>
      <Header />
      <div ref={pageRef} className="pd-page">

        {/* ——— HERO ——— */}
        <div ref={heroRef} className="pd-hero">

          {/* Back */}
          <div className="pd-back-wrap">
            <button onClick={() => navigate(-1)} className="pd-back-btn">
              <span className="pd-back-arrow">←</span> Retour
            </button>
            <span className="pd-hero-index">
              {String(currentIdx + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(allProjects.length).padStart(2, "0")}
            </span>
          </div>

          {/* Title */}
          <div className="pd-title-wrap">
            <h1 ref={titleRef} className="pd-title">{titleChars}</h1>
          </div>

          {/* Meta row */}
          <div className="pd-hero-grid">
            <div className="pd-hero-meta">
              <p className="pd-meta-label">Description</p>
              <p className="pd-meta-text">{project.shortDescription}</p>
            </div>

            <div className="pd-hero-meta">
              <p className="pd-meta-label">Stack</p>
              <div className="pd-stacks">
                {project.stacks.map(s => (
                  <div key={s.name} className="pd-stack-badge" title={s.name}>
                    <img
                      src={s.logo} alt={s.name} className="pd-stack-logo"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                    />
                    <span className="pd-stack-name">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {project.github && (
              <div className="pd-hero-meta">
                <p className="pd-meta-label">Code source</p>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="pd-github-btn">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="pd-github-icon">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.186.092-.923.35-1.544.637-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.192 20 14.436 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  Voir sur GitHub ↗
                </a>
              </div>
            )}
          </div>

          {/* Scroll cue */}
          <div className="pd-scroll-cue">
            <div className="pd-scroll-line" />
            <span className="pd-scroll-label">Scroll</span>
          </div>
        </div>

        {/* ——— MAIN IMAGE ——— */}
        <div ref={imgRef} className="pd-main-img-wrap">
          <img
            src={project.mainImage}
            alt={project.title}
            className="pd-main-img"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div className="pd-main-img-overlay" />
        </div>

        {/* ——— DESCRIPTION + GALLERY ——— */}
        <div className="pd-body">
          <div className="pd-body-inner">

            {/* Sticky description */}
            <div className="pd-desc-block">
              <p className="pd-desc-eyebrow">Description complète</p>
              <p className="pd-desc-text">{project.fullDescription}</p>
            </div>

            {/* Gallery */}
            {project.gallery.length > 0 && (
              <div className="pd-gallery">
                {project.gallery.map((img, i) => (
                  <div key={i} className="pd-gallery-item">
                    <span className="pd-gallery-num">{String(i + 1).padStart(2, "0")}</span>
                    <div className="pd-gallery-img-wrap">
                      <img
                        src={img}
                        alt={`${project.title} — écran ${i + 1}`}
                        className="pd-gallery-img"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ——— NEXT PROJECT ——— */}
        <div className="pd-next">
          <p className="pd-next-label">Projet suivant</p>
          <Link to={`/project/${nextProject.slug}`} className="pd-next-link">
            <span className="pd-next-title">{nextProject.title}</span>
            <span className="pd-next-arrow">↗</span>
          </Link>
        </div>

      </div>
      <Contact />
    </>
  );
}
