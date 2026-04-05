import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import experienceData from "../../data/experience.json";

type ExperiencePosition = { title: string; period: string; description: string };
type ExperienceItem     = { id: number; company: string; logo: string; positions: ExperiencePosition[] };

const experiences = (experienceData as { experiences: ExperienceItem[] }).experiences;

// Flatten into individual rows with sequential index
type Row = { company: string; logo: string; title: string; period: string; description: string; idx: number };
const rows: Row[] = experiences.flatMap((exp) =>
  exp.positions.map((pos) => ({
    company: exp.company,
    logo: exp.logo,
    title: pos.title,
    period: pos.period,
    description: pos.description,
    idx: 0,
  })),
).map((r, i) => ({ ...r, idx: i }));

export default function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".exp-eyebrow, .exp-heading",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", toggleActions: "play none none none" } },
      );
      gsap.fromTo(".exp-row",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: ".exp-list", start: "top 88%", toggleActions: "play none none none" } },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="experience-section">
      <div className="experience-inner">

        <p className="exp-eyebrow">Parcours professionnel</p>
        <h2 className="exp-heading">Expériences</h2>

        <div className="exp-list">
          {rows.map((row) => {
            const isOpen = openIdx === row.idx;
            return (
              <div
                key={row.idx}
                className={`exp-row${isOpen ? " exp-row--open" : ""}`}
                onClick={() => setOpenIdx(isOpen ? null : row.idx)}
              >
                <div className="exp-row-top">
                  {/* Left: big index */}
                  <span className="exp-row-num">{String(row.idx + 1).padStart(2, "0")}</span>

                  {/* Center: company + role */}
                  <div className="exp-row-main">
                    <div className="exp-row-header">
                      <span className="exp-row-company">{row.company}</span>
                      <span className="exp-row-separator">—</span>
                      <span className="exp-row-title">{row.title}</span>
                    </div>
                    <span className="exp-row-period">{row.period}</span>
                  </div>

                  {/* Right: logo + chevron */}
                  <div className="exp-row-right">
                    <img
                      src={row.logo}
                      alt={row.company}
                      className="exp-row-logo"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <span className={`exp-row-chevron${isOpen ? " exp-row-chevron--open" : ""}`}>{isOpen ? "−" : "+"}</span>
                  </div>
                </div>

                {/* Expandable description */}
                <div className={`exp-row-desc-wrap${isOpen ? " exp-row-desc-wrap--open" : ""}`}>
                  <p className="exp-row-desc">{row.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
