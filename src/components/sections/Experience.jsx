import React, { useState, useEffect } from "react"
import experienceData from "../../data/experience.json"
import BlurIn from "../animations/BlurIn"
import "../../style/_experience.css"

function Experience() {
  const [experiences] = useState(experienceData.experiences || [])
  const [selectedExperience, setSelectedExperience] = useState(experiences[0] || null)

  useEffect(() => {
    if (experiences.length > 0 && !selectedExperience) {
      setSelectedExperience(experiences[0])
    }
  }, [experiences, selectedExperience])

  return (
    <section 
      id="experience" 
      className="relative w-full bg-black px-[clamp(20px,5vw,60px)] py-20"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        paddingTop: '200px'
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        <BlurIn delay={0.2}>
          <h2 className="section-title text-5xl md:text-6xl font-title text-white mb-16 text-left">
            Experiences
          </h2>
        </BlurIn>

        <div className="experience-container" style={{ marginTop: '60px' }}>
          <div className="experience-layout">
            {/* Liste des entreprises à gauche */}
            <div className="company-list">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp)}
                  className={`company-item ${
                    selectedExperience?.id === exp.id ? "active" : ""
                  }`}
                >
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    className="company-logo"
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                  <div className="company-name">
                    {exp.company}
                  </div>
                </div>
              ))}
            </div>

            {/* Détails de l'expérience à droite */}
            {selectedExperience && (
              <div className="experience-details">
                <BlurIn delay={0.4}>
                  <div className="details-content">
                    {/* Contenu texte */}
                    <div className="details-text">
                      <h3 className="company-title">
                        {selectedExperience.company}
                      </h3>

                      {/* Timeline des positions */}
                      <div className="positions-timeline">
                        {selectedExperience.positions.map((position, index) => (
                          <div key={index} className="position-item">
                            <div className={`position-dot ${index === 0 ? "active" : ""}`} />
                            <div className="position-info">
                              <div className="position-title">
                                {position.title}
                              </div>
                              <div className="position-period">
                                {position.period}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <div className="position-description">
                        {selectedExperience.positions.map((position, index) => (
                          <p key={index}>
                            {position.description}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Image */}
                    {selectedExperience.image && (
                      <div className="details-image">
                        <div className="image-wrapper">
                          <img
                            src={selectedExperience.image}
                            alt={selectedExperience.company}
                          />
                          {selectedExperience.imageCaption && (
                            <div className="image-caption">
                              {selectedExperience.imageCaption}
                            </div>
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