import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import skillsData from "../../data/skills.json";

type Skill = { name: string; logo: string };
type StatData = { value: number; suffix: string; label: string };
type SkillsData = { frontend: Skill[]; tools: Skill[]; stats: StatData[] };

const data = skillsData as SkillsData;

export default function Skills() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelector(".skills-title"),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        section.querySelectorAll(".skill-item"),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".skills-group"), start: "top 82%", toggleActions: "play none none none" },
        }
      );

      data.stats.forEach((stat, i) => {
        const el = statRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.5,
          ease: "power2.out",
          snap: { val: 1 },
          scrollTrigger: {
            trigger: section.querySelector(".skills-stats"),
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val)) + stat.suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
      <div className="skills-inner">
        <h2 className="skills-title">Compétences</h2>

        <div className="skills-group">
          <p className="skills-group-label">Frontend & Frameworks</p>
          <div className="skills-grid">
            {data.frontend.map((skill) => (
              <div key={skill.name} className="skill-item">
                <img src={skill.logo} alt={skill.name} className="skill-logo" />
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-group">
          <p className="skills-group-label">Outils & Autres</p>
          <div className="skills-grid">
            {data.tools.map((skill) => (
              <div key={skill.name} className="skill-item">
                <img src={skill.logo} alt={skill.name} className="skill-logo" />
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-stats">
          {data.stats.map((stat, i) => (
            <div key={stat.label} className="skills-stat">
              <span className="skills-stat-value">
                <span ref={(el) => { statRefs.current[i] = el; }}>
                  0{stat.suffix}
                </span>
              </span>
              <span className="skills-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
