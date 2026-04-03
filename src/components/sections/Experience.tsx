import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import experienceData from "../../data/experience.json";

type ExperiencePosition = { title: string; period: string; description: string };
type ExperienceItem = { id: number; company: string; logo: string; positions: ExperiencePosition[] };

const experiences = (experienceData as { experiences: ExperienceItem[] }).experiences;

export default function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelector(".experience-title"),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        section.querySelectorAll(".experience-card"),
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.18, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".experience-stack"), start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="experience-section">
      <div className="experience-inner">
        <h2 className="experience-title">Expériences</h2>

        <div className="experience-stack">
          {experiences.map((exp, index) => (
            <article key={exp.id} className="experience-card">
              <span className="experience-card-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="experience-card-header">
                <h3 className="experience-company">{exp.company}</h3>
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="experience-logo"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>

              <div className="experience-roles">
                {exp.positions.map((pos, pi) => (
                  <div key={pi} className="experience-role">
                    <div className="experience-role-marker" />
                    <div className="experience-role-body">
                      <div className="experience-role-header">
                        <h4 className="experience-role-title">{pos.title}</h4>
                        <span className="experience-role-period">{pos.period}</span>
                      </div>
                      <p className="experience-role-description">{pos.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
