import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import projectsData from "../../data/projects.json"

function Projects() {
  const [projects] = useState(projectsData.projects || [])
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800
  })

  const isMobile = dimensions.width < 768

  // Configuration des tailles
  const CARD_SIZE = isMobile 
    ? dimensions.width * 0.85 
    : Math.min(dimensions.width * 0.45, dimensions.height * 0.85)

  const GAP = isMobile ? 30 : 200 
  
  const totalContentWidth = projects.length * CARD_SIZE + (projects.length - 1) * GAP

  useEffect(() => {
    let ticking = false

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    const updateScroll = () => {
      if (!sectionRef.current) return

      const section = sectionRef.current
      const sectionRect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const totalHeight = section.offsetHeight
      const scrollableHeight = totalHeight - windowHeight
      const sectionTop = sectionRect.top
      
      if (sectionTop > 0) {
        setScrollProgress(0)
        return
      }
      
      if (sectionTop < -scrollableHeight) {
        setScrollProgress(1)
        return
      }
      
      const scrolled = Math.abs(sectionTop)
      const progress = scrolled / scrollableHeight
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", handleResize)
    updateScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const startOffset = dimensions.width
  const maxTranslate = totalContentWidth + dimensions.width + CARD_SIZE
  const currentTranslateX = startOffset - (scrollProgress * maxTranslate)

  return (
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="projects-sticky-container">
        <div className="max-w-[1100px] mx-auto w-full projects-inner">
          <h2 className="section-title text-white">Projects</h2>

          <div className="projects-viewport">
            <div className="projects-track" style={{ transform: `translateX(${currentTranslateX}px)` }}>
              {projects.map((project, index) => {
                const cardLeftPos = index * (CARD_SIZE + GAP)
                const currentScreenPos = cardLeftPos + currentTranslateX
                const cardCenter = currentScreenPos + CARD_SIZE / 2
                const screenCenter = dimensions.width / 2
                const distFromCenter = (cardCenter - screenCenter) / (dimensions.width / 2)
                
                const yOffset = isMobile 
                  ? 0 
                  : Math.abs(distFromCenter) * 200 + 50
                
                const rotation = distFromCenter * 5

                return (
                  <Link
                    key={project.slug}
                    to={`/project/${project.slug}`}
                    className="project-card"
                    style={{
                      width: `${CARD_SIZE}px`,
                      // On applique l'écart via marginRight sauf pour le dernier
                      marginRight: index === projects.length - 1 ? 0 : `${GAP}px`,
                      transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
                      zIndex: 100 - Math.round(Math.abs(distFromCenter) * 10)
                    }}
                  >
                    <div className="project-card-inner">
                      <div className="project-image-container">
                        <img
                          src={project.mainImage}
                          alt={project.title}
                          className="project-image"
                          onError={(e) => { e.target.style.display = "none" }}
                        />
                      </div>
                      <h3 className="project-title">{project.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects