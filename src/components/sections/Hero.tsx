import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf";
import FloatingCard from "../ui/FloatingCard";

const FIRST = "Aathavan";
const LAST = "Thevakumar";

function splitLetters(text: string, cls: string) {
  return text.split("").map((ch, i) => (
    <span key={i} className={cls} style={{ display: "inline-block", willChange: "transform" }}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

export default function Hero() {
  const sectionRef  = useRef<HTMLElement | null>(null);
  const curtainRef  = useRef<HTMLDivElement | null>(null);
  const firstRef    = useRef<HTMLSpanElement | null>(null);
  const lastRef     = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const curtain   = curtainRef.current;
      const firstEl   = firstRef.current;
      const lastEl    = lastRef.current;
      const section   = sectionRef.current;

      if (!curtain || !firstEl || !lastEl || !section) return;

      const firstLetters = firstEl.querySelectorAll<HTMLElement>(".hero-letter");
      const lastLetters  = lastEl.querySelectorAll<HTMLElement>(".hero-letter");
      const tagline      = section.querySelector<HTMLElement>(".hero-tagline");
      const desc         = section.querySelector<HTMLElement>(".hero-desc");
      const actions      = section.querySelector<HTMLElement>(".hero-actions");
      const scrollInd    = section.querySelector<HTMLElement>(".hero-scroll-indicator");
      const photo        = section.querySelector<HTMLElement>(".hero-photo-wrap");
      const cards        = section.querySelectorAll<HTMLElement>(".floating-card");

      // Start: hide everything
      gsap.set([...firstLetters, ...lastLetters], { yPercent: 110, rotate: 3 });
      gsap.set([tagline, desc, actions, scrollInd], { y: 28, opacity: 0 });
      gsap.set(photo, { scale: 0.88, opacity: 0 });
      gsap.set(cards, { y: 20, opacity: 0, scale: 0.92 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Curtain sweeps right → off screen
      tl.to(curtain, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.85,
        ease: "power4.inOut",
      })
      // 2. Letters cascade in
      .to([...firstLetters, ...lastLetters], {
        yPercent: 0,
        rotate: 0,
        duration: 1.0,
        stagger: 0.03,
        ease: "expo.out",
      }, "-=0.4")
      // 3. Tagline + desc + actions
      .to([tagline, desc, actions], {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.1,
      }, "-=0.5")
      // 4. Photo
      .to(photo, {
        scale: 1,
        opacity: 1,
        duration: 0.75,
        ease: "power2.out",
      }, "-=0.65")
      // 5. Floating cards stagger
      .to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.12,
        ease: "back.out(1.4)",
      }, "-=0.4")
      // 6. Scroll indicator
      .to(scrollInd, {
        y: 0,
        opacity: 1,
        duration: 0.5,
      }, "-=0.2");

      // Ongoing: scroll line pulse
      gsap.to(".hero-scroll-line", {
        scaleY: 0.4,
        transformOrigin: "top center",
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });

      // Ongoing: gentle float on name
      gsap.to([firstEl, lastEl], {
        y: -6,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="hero-section">
      {/* Curtain */}
      <div ref={curtainRef} className="hero-curtain" />

      {/* Ghost background name */}
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
              <span ref={firstRef} className="hero-name">
                {splitLetters(FIRST, "hero-letter")}
              </span>
            </div>
            <div className="hero-name-wrap">
              <span ref={lastRef} className="hero-name">
                {splitLetters(LAST, "hero-letter")}
              </span>
            </div>
          </div>

          <p className="hero-desc">
            Je conçois des expériences web modernes, performantes et accessibles.
            Alternant chez Xelians, passionné de design et de code.
          </p>

          <div className="hero-actions">
            <Link to="/projects" className="btn-pill btn-violet">
              Voir mes projets
            </Link>
            <a href="#contact" className="btn-pill btn-outline">
              Me contacter
            </a>
            <a
              href={monCV}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-amber"
            >
              Mon CV
            </a>
          </div>

          <div className="hero-scroll-indicator">
            <div className="hero-scroll-line" />
            <span className="hero-scroll-label">Scroll</span>
          </div>
        </div>

        {/* Right */}
        <div className="hero-right">
          <div className="hero-photo-wrap">
            <div className="hero-photo-border" />
            <img
              src={aathavanPhoto}
              alt="Aathavan Thevakumar"
              className="hero-photo"
            />
          </div>

          <FloatingCard
            label="Poste actuel"
            value="@ Xelians"
            icon="💼"
            className="hero-card-1"
          />
          <FloatingCard
            label="Formation"
            value="BUT MMI 2026"
            icon="🎓"
            className="hero-card-2"
          />
          <FloatingCard
            label="Projets réalisés"
            value="6 projets"
            icon="🚀"
            className="hero-card-3"
          />
        </div>
      </div>
    </section>
  );
}
