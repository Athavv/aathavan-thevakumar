import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import { gsap } from "gsap"
import projectsData from "../../data/projects.json"
import { useWindowSize } from "../../hooks/useWindowSize"
import { useThrottle } from "../../hooks/useThrottle"
import { CARD_COLORS } from "../../utils/constants"

const ProjectCard = React.memo(({ 
  project, 
  index, 
  cardSize, 
  gap, 
  translateX, 
  viewportCenter, 
  viewportWidth,
  totalProjects 
}) => {
  const cardLeftPos = index * (cardSize + gap)
  const cardLeftInTrack = cardLeftPos + translateX
  const cardCenterInTrack = cardLeftInTrack + cardSize / 2
  
  const distFromCenterPx = cardCenterInTrack - viewportCenter
  const distFromCenter = distFromCenterPx / (viewportWidth / 2)
  
  const angle = distFromCenter * 0.8
  const yOffset = 300 * (1 - Math.cos(angle))
  const centerPull = -distFromCenter * 0.02 * viewportWidth
  const isCentered = Math.abs(distFromCenter) < 0.15
  const xOffset = isCentered 
    ? centerPull
    : 300 * Math.sin(angle) * 0.1 + centerPull
  
  const rotation = distFromCenter * 8
  const cardColor = CARD_COLORS[index % CARD_COLORS.length]

  return (
    <Link
      to={`/project/${project.slug}`}
      className="project-card"
      style={{
        width: `${cardSize}px`,
        marginRight: index === totalProjects - 1 ? 0 : `${gap}px`,
        transform: `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${rotation}deg)`,
        zIndex: 100 - Math.round(Math.abs(distFromCenter) * 10),
        willChange: 'transform'
      }}
    >
      <div 
        className="project-card-inner"
        style={{ '--card-color': cardColor }}
      >
        <div className="project-image-container">
          <img
            src={project.mainImage}
            alt={project.title}
            className="project-image"
            loading="lazy"
            onError={(e) => { e.target.style.display = "none" }}
          />
        </div>
        <h3 className="project-title">{project.title}</h3>
      </div>
    </Link>
  )
})

ProjectCard.displayName = 'ProjectCard'

function Projects() {
  const [projects] = useState(projectsData.projects || [])
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const gsapInstanceRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [animatedTranslateX, setAnimatedTranslateX] = useState(0)
  const dimensions = useWindowSize()

  const isMobile = dimensions.width < 768

  const { CARD_SIZE, GAP, startOffset, maxTranslate } = useMemo(() => {
    const cardSize = isMobile 
      ? dimensions.width * 0.85 
      : Math.min(dimensions.width * 0.45, dimensions.height * 0.85)
    const gap = isMobile ? 30 : 200
    const start = dimensions.width + cardSize
    const max = (projects.length * cardSize + (projects.length - 1) * gap) + dimensions.width * 2

    return {
      CARD_SIZE: cardSize,
      GAP: gap,
      startOffset: start,
      maxTranslate: max
    }
  }, [isMobile, dimensions.width, dimensions.height, projects.length])

  const targetTranslateX = useMemo(() => {
    return startOffset - (scrollProgress * maxTranslate)
  }, [startOffset, scrollProgress, maxTranslate])

  const updateScroll = useCallback(() => {
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
  }, [])

  const throttledUpdateScroll = useThrottle(updateScroll, 16)

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(throttledUpdateScroll)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [throttledUpdateScroll, updateScroll])
  
  useEffect(() => {
    if (!trackRef.current || !viewportRef.current) return

    const viewportWidth = viewportRef.current.offsetWidth || dimensions.width
    const viewportCenter = viewportWidth / 2
    
    let closestCardIndex = 0
    let minDistance = Infinity
    
    for (let index = 0; index < projects.length; index++) {
      const cardLeftPos = index * (CARD_SIZE + GAP)
      const cardCenterInTrack = cardLeftPos + targetTranslateX + CARD_SIZE / 2
      const distance = Math.abs(cardCenterInTrack - viewportCenter)
      
      if (distance < minDistance) {
        minDistance = distance
        closestCardIndex = index
      }
    }
    
    const targetCardLeftPos = closestCardIndex * (CARD_SIZE + GAP)
    const targetCardCenter = targetCardLeftPos + CARD_SIZE / 2
    const snappedTranslateX = viewportCenter - targetCardCenter
    
    const distanceToSnap = Math.abs(snappedTranslateX - targetTranslateX)
    const maxDistance = CARD_SIZE + GAP
    const snapStrength = Math.max(0.1, Math.min(0.25, 1 - (distanceToSnap / maxDistance) * 0.5))
    
    const smoothedTranslateX = targetTranslateX + (snappedTranslateX - targetTranslateX) * snapStrength
    const adaptiveDuration = Math.max(0.4, Math.min(0.8, distanceToSnap / 200))
    
    if (gsapInstanceRef.current) {
      gsapInstanceRef.current.kill()
    }
    
    gsapInstanceRef.current = gsap.to(trackRef.current, {
      x: smoothedTranslateX,
      duration: adaptiveDuration,
      ease: "power2.out",
      overwrite: true,
      force3D: true,
      onUpdate: () => {
        if (trackRef.current) {
          const currentX = gsap.getProperty(trackRef.current, "x")
          setAnimatedTranslateX(typeof currentX === 'number' ? currentX : 0)
        }
      }
    })
    
    return () => {
      if (gsapInstanceRef.current) {
        gsapInstanceRef.current.kill()
      }
    }
  }, [targetTranslateX, CARD_SIZE, GAP, projects.length, dimensions.width])
  
  const currentTranslateX = animatedTranslateX || targetTranslateX

  const viewportWidth = useMemo(() => {
    return viewportRef.current?.offsetWidth || dimensions.width
  }, [dimensions.width])

  const viewportCenter = useMemo(() => viewportWidth / 2, [viewportWidth])

  return (
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="projects-sticky-container">
        <div className="max-w-[1100px] mx-auto w-full projects-inner">
          <h2 className="section-title text-white">Projets</h2>

          <div ref={viewportRef} className="projects-viewport">
            <div ref={trackRef} className="projects-track">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.slug} 
                  project={project} 
                  index={index}
                  cardSize={CARD_SIZE}
                  gap={GAP}
                  translateX={currentTranslateX}
                  viewportCenter={viewportCenter}
                  viewportWidth={viewportWidth}
                  totalProjects={projects.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects