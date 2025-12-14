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
  const CARD_SIZE = isMobile ? dimensions.width * 0.85 : Math.min(dimensions.width * 0.7, dimensions.height * 0.85)
  const GAP = isMobile ? 40 : 180
  
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

  // Start with all cards off-screen to the right
  const startOffset = dimensions.width
  // End with all cards off-screen to the left - add extra space to ensure last card exits
  const maxTranslate = totalContentWidth + dimensions.width + CARD_SIZE
  const currentTranslateX = startOffset - (scrollProgress * maxTranslate)

  return (
    <section 
      ref={sectionRef}
      id="projects"
      className="relative w-full bg-black"
      style={{ 
        height: "500vh",
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div 
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div className="max-w-[1100px] mx-auto w-full" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <h2 className="section-title text-5xl md:text-6xl font-title text-white text-left" style={{ paddingTop: '50px' }}>
            Projects
          </h2>

          <div style={{
            position: "relative",
            width: "100%",
            flex: 1,
            display: "flex",
            alignItems: "center",
            zIndex: 10,
            marginLeft: '-80px'
          }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                left: 0,
                gap: `${GAP}px`,
                transform: `translateX(${currentTranslateX}px)`,
                willChange: "transform"
              }}
            >
              {projects.map((project, index) => {
                
                const cardLeftPos = index * (CARD_SIZE + GAP)
                const currentScreenPos = cardLeftPos + currentTranslateX
                const cardCenter = currentScreenPos + CARD_SIZE / 2
                const screenCenter = dimensions.width / 2
                
                // Calculate position relative to screen center (-1 = left edge, 0 = center, 1 = right edge)
                const distFromCenter = (cardCenter - screenCenter) / (dimensions.width / 2)
                
                // Cards enter from bottom-right and exit bottom-left
                // When card is on the right (distFromCenter > 0), move down
                // When card is on the left (distFromCenter < 0), move down
                // Center card (distFromCenter ≈ 0) is highest
                const yOffset = Math.abs(distFromCenter) * 200 + 100
                
                // Slight rotation based on position
                const rotation = distFromCenter * 5

                return (
                  <Link
                    key={project.slug}
                    to={`/project/${project.slug}`}
                    className="relative flex-shrink-0 group"
                    style={{
                      width: `${CARD_SIZE}px`,
                      height: `${CARD_SIZE}px`,
                      transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
                      zIndex: 100 - Math.round(Math.abs(distFromCenter) * 10),
                      transition: "transform 0.1s linear",
                      willChange: "transform"
                    }}
                  >
                    <div className="w-full h-full rounded-[3rem] transition-all duration-500 group-hover:scale-[1.03] flex flex-col items-center" 
                         style={{ 
                           backgroundColor: 'rgba(30, 41, 59, 0.4)',
                           backdropFilter: 'blur(10px)'
                         }}>
                      
                      <div className="w-[90%] h-[42%] aspect-square overflow-hidden rounded-[2rem]">
                        <img
                          src={project.mainImage}
                          alt={project.title}
                          className="w-full mb-10 object-cover group-hover:scale-110 transition-all duration-700"
                          onError={(e) => { e.target.style.display = "none" }}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl md:text-3xl">
                          {project.title}
                        </h3>
                      </div>
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