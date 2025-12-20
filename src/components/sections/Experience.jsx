import React, { useState, useMemo } from "react"
import experienceData from "../../data/experience.json"
import BlurIn from "../animations/BlurIn"

function Experience() {
  const experiences = useMemo(() => experienceData.experiences || [], [])
  const [selectedExperience, setSelectedExperience] = useState(experiences[0] || null)

  return (
    <section id="experience" className="experience-section">
      <div className="max-w-[1100px] mx-auto">
        <BlurIn delay={0.2}>
          <h2 className="section-title">Expériences</h2>
        </BlurIn>

        <div className="experience-container">
          <div className="experience-layout">
            <div className="company-list">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp)}
                  className={`company-item ${selectedExperience?.id === exp.id ? "active" : ""}`}
                >
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    className="company-logo"
                    loading="lazy"
                    onError={(e) => { e.target.style.display = "none" }}
                  />
                  <div className="company-name">{exp.company}</div>
                </div>
              ))}
            </div>

            {selectedExperience && (
              <div className="experience-details">
                <BlurIn delay={0.4}>
                  <div className="details-content">
                    <div className="details-text">
                      <h3 className="company-title">{selectedExperience.company}</h3>

                      <div className="positions-timeline">
                        {selectedExperience.positions.map((position, index) => (
                          <div key={index} className="position-item">
                            <div className={`position-dot ${index === 0 ? "active" : ""}`} />
                            <div className="position-info">
                              <div className="position-title">{position.title}</div>
                              <div className="position-period">{position.period}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="position-description">
                        {selectedExperience.positions.map((position, index) => (
                          <p key={index}>{position.description}</p>
                        ))}
                      </div>
                    </div>

                    {selectedExperience.image && (
                      <div className="details-image">
                        <div className="image-wrapper">
                          <img 
                            src={selectedExperience.image} 
                            alt={selectedExperience.company}
                            loading="lazy"
                          />
                          {selectedExperience.imageCaption && (
                            <div className="image-caption">{selectedExperience.imageCaption}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </BlurIn>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience