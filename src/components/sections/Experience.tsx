import type { CSSProperties } from "react";
import experienceData from "../../data/experience.json";
import BlurIn from "../animations/BlurIn.tsx";

type ExperiencePosition = {
  title: string;
  period: string;
  description: string;
};

type ExperienceItem = {
  id: number;
  company: string;
  logo: string;
  positions: ExperiencePosition[];
  image?: string;
  imageCaption?: string;
};

type ExperienceData = {
  experiences: ExperienceItem[];
};

export default function Experience() {
  const typedData = experienceData as ExperienceData;
  const experiences = typedData.experiences || [];
  const totalRoles = experiences.reduce(
    (count, experience) => count + experience.positions.length,
    0,
  );
  const latestExperience = experiences[0];

  return (
    <section id="experience" className="experience-section">
      <div className="experience-shell">
        <div className="experience-overview">
          <BlurIn delay={0.2}>
            <h2 className="section-title">Experiences</h2>
          </BlurIn>

          <p className="experience-intro">
            Mes expériences s’articulent autour du développement front-end, du
            back-end applicatif et de l’amélioration continue de produits web en
            environnement agile.
          </p>

          <div className="experience-metrics">
            <div className="experience-metric">
              <span className="experience-metric-value">
                {String(experiences.length).padStart(2, "0")}
              </span>
              <span className="experience-metric-label">expériences</span>
            </div>
            <div className="experience-metric">
              <span className="experience-metric-value">
                {String(totalRoles).padStart(2, "0")}
              </span>
              <span className="experience-metric-label">missions</span>
            </div>
            <div className="experience-metric">
              <span className="experience-metric-value">
                {latestExperience?.positions[0]?.title ?? "—"}
              </span>
              <span className="experience-metric-label">focus actuel</span>
            </div>
          </div>
        </div>

        <div className="experience-stack">
          {experiences.map((experience, index) => (
            <article
              key={experience.id}
              className="experience-card"
              style={{ "--experience-index": index } as CSSProperties}
            >
              <div className="experience-card-top">
                <div className="experience-card-heading">
                  <span className="experience-card-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="experience-company">{experience.company}</h3>
                    <p className="experience-company-caption">
                      {experience.positions
                        .map((position) => position.period)
                        .join(" · ")}
                    </p>
                  </div>
                </div>

                <img
                  src={experience.logo}
                  alt={experience.company}
                  className="experience-logo"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>

              <div className="experience-roles">
                {experience.positions.map((position, positionIndex) => (
                  <div key={positionIndex} className="experience-role">
                    <div className="experience-role-marker" />
                    <div className="experience-role-body">
                      <div className="experience-role-header">
                        <h4 className="experience-role-title">
                          {position.title}
                        </h4>
                        <span className="experience-role-period">
                          {position.period}
                        </span>
                      </div>
                      <p className="experience-role-description">
                        {position.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {experience.image && (
                <div className="experience-visual">
                  <div className="experience-visual-frame">
                    <img src={experience.image} alt={experience.company} />
                    {experience.imageCaption && (
                      <div className="experience-visual-caption">
                        {experience.imageCaption}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
