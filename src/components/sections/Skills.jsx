import React, { useEffect, useRef, useMemo } from "react"
import { gsap } from "gsap"
import skillsData from "../../data/skills.json"
import "../../style/_skills.css"

function Skills() {
  const sectionRef = useRef(null)
  const { skills, categories, categoryColors } = skillsData

  const groupedSkills = useMemo(() => {
    return categories.map(category => ({
      category,
      skills: skills.filter(skill => skill.category === category)
    })).filter(group => group.skills.length > 0)
  }, [categories, skills])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const planets = sectionRef.current?.querySelectorAll(".planet")
            if (planets) {
              gsap.from(planets, {
                opacity: 0,
                scale: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)"
              })
            }
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const radius = 180
    const planetRadius = 100

    for (let i = 0; i < groupedSkills.length; i++) {
      const group = groupedSkills[i]
      const orbitContainer = sectionRef.current?.querySelector(`.orbit-container[data-category="${group.category}"]`)
      const orbitItems = orbitContainer?.querySelectorAll(".orbit-item")
      
      if (orbitItems && orbitItems.length > 0) {
        for (let j = 0; j < orbitItems.length; j++) {
          const item = orbitItems[j]
          const angle = (360 / orbitItems.length) * j
          const rad = (angle * Math.PI) / 180
          const x = Math.cos(rad) * radius
          const y = Math.sin(rad) * radius
          
          const absY = Math.abs(y)
          const isBehind = y > 0 && absY < planetRadius * 0.8
          
          gsap.set(item, {
            x: x,
            y: y,
            opacity: 1,
            scale: 1
          })
          
          if (isBehind) {
            item.classList.add('orbit-behind')
            item.classList.remove('orbit-front')
          } else {
            item.classList.add('orbit-front')
            item.classList.remove('orbit-behind')
          }
        }
      }
    }
  }, [groupedSkills])

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="section-title text-white">Compétences</h2>

        <div className="planets-container">
          {groupedSkills.map((group) => {
            const color = categoryColors[group.category] || "#6b7280"
            
            return (
              <div key={group.category} className="planet-wrapper">
                <div
                  className="planet"
                  style={{ '--planet-color': color }}
                >
                  <div className="planet-core">
                    <span className="planet-label">{group.category}</span>
                  </div>
                  
                  <div 
                    className="orbit-container"
                    data-category={group.category}
                  >
                    {group.skills.map((skill) => {
                      return (
                        <div
                          key={skill.name}
                          className="orbit-item"
                        >
                          <div className="orbit-skill">
                            {skill.logo ? (
                              <img 
                                src={skill.logo} 
                                alt={skill.name}
                                className="orbit-icon"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.style.display = "none"
                                  const fallback = e.target.nextElementSibling
                                  if (fallback) fallback.style.display = "flex"
                                }}
                              />
                            ) : null}
                            <div className="orbit-icon-fallback" style={{ display: skill.logo ? "none" : "flex" }}>
                              {skill.name.charAt(0)}
                            </div>
                            <span className="orbit-skill-name">{skill.name}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Skills
