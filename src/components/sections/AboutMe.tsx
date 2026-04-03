import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf";

export default function AboutMe() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef    = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section  = sectionRef.current;
      const lineFill = lineRef.current;
      if (!section || !lineFill) return;

      gsap.fromTo(
        section.querySelector(".about-title"),
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        section.querySelector(".about-photo-frame"),
        { scale: 0.92, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        [section.querySelector(".about-desc"), section.querySelector(".about-timeline-label")],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-text-col"), start: "top 82%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        lineFill,
        { height: "0%" },
        {
          height: "100%", duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-timeline"), start: "top 80%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        section.querySelectorAll(".about-timeline-item"),
        { x: 20, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-timeline"), start: "top 80%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        section.querySelector(".about-cv-btn"),
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-timeline"), start: "top 70%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="about-inner">
        <div className="about-photo-col">
          <div className="about-photo-frame">
            <div className="about-photo-accent" />
            <img src={aathavanPhoto} alt="Aathavan Thevakumar" className="about-photo" />
          </div>
        </div>

        <div className="about-text-col">
          <h2 className="about-title">À Propos</h2>

          <p className="about-desc">
            Développeur fullstack en alternance chez{" "}
            <a href="https://xelians.fr/" target="_blank" rel="noopener noreferrer">Xelians</a>
            , actuellement en troisième année de BUT MMI à l'IUT de Marne-la-Vallée.
            Je conçois et développe des interfaces web modernes avec une attention
            particulière portée au design, à la performance et aux animations.
          </p>

          <div>
            <p className="about-timeline-label">Parcours</p>
            <div className="about-timeline">
              <div className="about-timeline-line" />
              <div ref={lineRef} className="about-timeline-line-fill" />

              <div className="about-timeline-item">
                <div className="about-timeline-dot about-timeline-dot--active" />
                <span className="about-timeline-school">IUT de Marne-la-Vallée</span>
                <span className="about-timeline-degree">BUT Métiers du Multimédia et de l'Internet</span>
                <span className="about-timeline-date">2023 — 2026</span>
              </div>

              <div className="about-timeline-item">
                <div className="about-timeline-dot" />
                <span className="about-timeline-school">Lycée Germaine Tillion</span>
                <span className="about-timeline-degree">Baccalauréat général — Mention Assez Bien</span>
                <span className="about-timeline-date">2020 — 2023</span>
              </div>
            </div>
          </div>

          <a
            href={monCV}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-amber about-cv-btn"
            style={{ alignSelf: "flex-start" }}
          >
            Voir mon CV
          </a>
        </div>
      </div>
    </section>
  );
}
