import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf";
import projectsData from "../../data/projects.json";

const FIRST = "Aathavan";
const LAST  = "Thevakumar";

type Project = { slug: string; title: string; shortDescription: string; mainImage: string };
const projects = (projectsData as { projects: Project[] }).projects;

function splitLetters(text: string, cls: string) {
  return text.split("").map((ch, i) => (
    <span key={i} className={cls} style={{ display: "inline-block", willChange: "transform" }}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

// Dynamic project card — cycles every 2.5s
function DynamicProjectCard() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % projects.length);
        setVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const p = projects[idx];
  return (
    <Link
      to={`/project/${p.slug}`}
      className={`hero-proj-card${visible ? " hero-proj-card--in" : " hero-proj-card--out"}`}
      style={{ textDecoration: "none" }}
    >
      <div className="hero-proj-thumb">
        <img src={p.mainImage} alt={p.title} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        <div className="hero-proj-thumb-overlay" />
      </div>
      <div className="hero-proj-body">
        <div className="hero-proj-top-row">
          <span className="hero-proj-eyebrow">Projet récent</span>
          <span className="hero-proj-index">{String(idx + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}</span>
        </div>
        <span className="hero-proj-title">{p.title}</span>
        <p className="hero-proj-desc">{p.shortDescription}</p>
        <div className="hero-proj-cta">
          <span>Voir le projet</span>
          <span className="hero-proj-arrow">↗</span>
        </div>
      </div>
      <div className="hero-proj-dot" aria-hidden="true" />
    </Link>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const firstRef   = useRef<HTMLSpanElement | null>(null);
  const lastRef    = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const curtain    = curtainRef.current;
      const firstEl    = firstRef.current;
      const lastEl     = lastRef.current;
      const section    = sectionRef.current;
      if (!curtain || !firstEl || !lastEl || !section) return;

      const firstLetters = firstEl.querySelectorAll<HTMLElement>(".hero-letter");
      const lastLetters  = lastEl.querySelectorAll<HTMLElement>(".hero-letter");
      const tagline      = section.querySelector<HTMLElement>(".hero-tagline");
      const desc         = section.querySelector<HTMLElement>(".hero-desc");
      const actions      = section.querySelector<HTMLElement>(".hero-actions");
      const scrollInd    = section.querySelector<HTMLElement>(".hero-scroll-indicator");
      const photo        = section.querySelector<HTMLElement>(".hero-photo-wrap");
      const projCard     = section.querySelector<HTMLElement>(".hero-proj-card");

      gsap.set([...firstLetters, ...lastLetters], { yPercent: 110, rotate: 3 });
      gsap.set([tagline, desc, actions, scrollInd], { y: 28, opacity: 0 });
      gsap.set(photo, { scale: 0.88, opacity: 0 });
      gsap.set(projCard, { y: 20, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(curtain, { scaleX: 0, transformOrigin: "right center", duration: 0.7, ease: "power4.inOut" })
        .to([...firstLetters, ...lastLetters], { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.03, ease: "expo.out" }, "-=0.35")
        .to([tagline, desc, actions], { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.45")
        .to(photo, { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.55")
        .to(projCard, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, "-=0.3")
        .to(scrollInd, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2");

      gsap.to(".hero-scroll-line", {
        scaleY: 0.4, transformOrigin: "top center",
        duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.5,
      });
      gsap.to([firstEl, lastEl], {
        y: -6, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="hero-section">
      <div ref={curtainRef} className="hero-curtain" />

      <div className="hero-bg-name" aria-hidden="true">
        <span>Aathavan</span>
        <span>Thevakumar</span>
      </div>

      <div className="hero-inner">
        {/* Left */}
        <div className="hero-left">
          <p className="hero-tagline">Développeur Full Stack</p>
          <div>
            <div className="hero-name-wrap">
              <span ref={firstRef} className="hero-name">{splitLetters(FIRST, "hero-letter")}</span>
            </div>
            <div className="hero-name-wrap">
              <span ref={lastRef} className="hero-name">{splitLetters(LAST, "hero-letter")}</span>
            </div>
          </div>
          <p className="hero-desc">
            Je conçois des expériences web modernes, performantes et accessibles.
            Alternant chez Xelians, passionné de design et de code.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn-pill btn-violet">Voir mes projets</Link>
            <a href="#contact" className="btn-pill btn-outline">Me contacter</a>
            <a href={monCV} target="_blank" rel="noopener noreferrer" className="btn-pill btn-amber">Mon CV</a>
          </div>
          <div className="hero-scroll-indicator">
            <div className="hero-scroll-line" />
            <span className="hero-scroll-label">Scroll</span>
          </div>
        </div>

        {/* Right — photo + mini suns orbiting, no floating cards */}
        <div className="hero-right">
          <div className="hero-photo-wrap">
            <div className="hero-photo-border" />
            <img src={aathavanPhoto} alt="Aathavan Thevakumar" className="hero-photo" />

          </div>

          {/* Dynamic project card */}
          <DynamicProjectCard />
        </div>
      </div>
    </section>
  );
}
