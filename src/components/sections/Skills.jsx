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
    // Radius pour l'orbite - juste un peu plus grand que la planète pour éviter le chevauchement
    const radius = 130
    const planetRadius = 100

    // Définir les axes de rotation pour chaque planète
    // Chaque planète aura un plan d'orbite différent
    const orbitPlanes = [
      { normal: { x: 1, y: 1, z: 0 }, rotation: { x: 1, y: 1, z: 0 } }, // Frontend - Plan diagonal haut gauche à bas droite
      { normal: { x: -1, y: 1, z: 0 }, rotation: { x: -1, y: 1, z: 0 } }, // Backend - Plan diagonal haut droite à bas gauche
      { normal: { x: 1, y: -1, z: 1 }, rotation: { x: 1, y: -1, z: 1 } }, // Design - Plan diagonal avec profondeur
      { normal: { x: -1, y: 1, z: 1 }, rotation: { x: -1, y: 1, z: 1 } }, // Tools & DevOps - Plan diagonal avec profondeur
    ]

    // Stocker les informations pour chaque élément
    const itemData = new Map()

    for (let i = 0; i < groupedSkills.length; i++) {
      const group = groupedSkills[i]
      const orbitContainer = sectionRef.current?.querySelector(`.orbit-container[data-category="${group.category}"]`)
      const orbitItems = orbitContainer?.querySelectorAll(".orbit-item")
      const plane = orbitPlanes[i] || orbitPlanes[0]
      
      if (orbitItems && orbitItems.length > 0) {
        for (let j = 0; j < orbitItems.length; j++) {
          const item = orbitItems[j]
          const skillElement = item.querySelector(".orbit-skill")
          const angle = (360 / orbitItems.length) * j
          const rad = (angle * Math.PI) / 180
          
          // Calculer les positions initiales sur le plan d'orbite
          // On crée un cercle dans le plan défini par le vecteur normal
          let x, y, z
          
          const nx = plane.normal.x
          const ny = plane.normal.y
          const nz = plane.normal.z
          
          // Créer deux vecteurs orthogonaux dans le plan
          // Vecteur 1 : perpendiculaire à (nx, ny, nz) et à (0, 0, 1)
          let v1x, v1y, v1z
          if (nz === 0) {
            // Plan horizontal ou diagonal
            v1x = -ny
            v1y = nx
            v1z = 0
          } else {
            v1x = -ny
            v1y = nx
            v1z = 0
          }
          
          // Normaliser v1
          const v1Len = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z)
          if (v1Len > 0) {
            v1x /= v1Len
            v1y /= v1Len
            v1z /= v1Len
          }
          
          // Vecteur 2 : produit vectoriel de normal et v1
          const v2x = ny * v1z - nz * v1y
          const v2y = nz * v1x - nx * v1z
          const v2z = nx * v1y - ny * v1x
          
          // Position sur le cercle dans le plan
          x = (v1x * Math.cos(rad) + v2x * Math.sin(rad)) * radius
          y = (v1y * Math.cos(rad) + v2y * Math.sin(rad)) * radius
          z = (v1z * Math.cos(rad) + v2z * Math.sin(rad)) * radius
          
          // Stocker les données initiales pour calculer la position z
          itemData.set(item, { 
            initialAngle: rad,
            initialZ: z,
            plane: plane,
            radius: radius,
            skillElement: skillElement,
            rotationIndex: i
          })
          
          gsap.set(item, {
            x: x,
            y: y,
            z: z,
            opacity: 1,
            scale: 1,
            transformStyle: "preserve-3d"
          })
          
          // La rotation inverse sera gérée par CSS pour une meilleure synchronisation
          // Les classes CSS seront appliquées automatiquement via les sélecteurs
        }
      }
    }

    // Durées d'animation pour chaque rotation (en secondes)
    const animationDurations = [30, 35, 28, 32]
    
    // Axes de rotation pour chaque planète (doit correspondre aux animations CSS)
    const rotationAxes = [
      { x: 1, y: 1, z: 0 },    // Frontend - rotate3d(1, 1, 0, ...)
      { x: -1, y: 1, z: 0 },   // Backend - rotate3d(-1, 1, 0, ...)
      { x: 1, y: -1, z: 1 },   // Design - rotate3d(1, -1, 1, ...)
      { x: -1, y: 1, z: 1 }    // Tools & DevOps - rotate3d(-1, 1, 1, ...)
    ]
    
    // Fonction pour mettre à jour le z-index et la rotation inverse
    const updateZIndexAndRotation = () => {
      const currentTime = performance.now() / 1000 // Temps en secondes
      
      itemData.forEach((data, item) => {
        const skillElement = data.skillElement
        if (!skillElement) return
        
        // Calculer l'angle de rotation actuel basé sur le temps
        const duration = animationDurations[data.rotationIndex] || 30
        const rotationAngleDeg = ((currentTime % duration) / duration) * 360
        const rotationAngle = rotationAngleDeg * (Math.PI / 180)
        
        // Calculer la position z actuelle après rotation
        const plane = data.plane
        const nx = plane.normal.x
        const ny = plane.normal.y
        const nz = plane.normal.z
        
        // Calculer les vecteurs de base du plan (même calcul que pour la position initiale)
        let v1x, v1y, v1z
        if (nz === 0) {
          v1x = -ny
          v1y = nx
          v1z = 0
        } else {
          v1x = -ny
          v1y = nx
          v1z = 0
        }
        
        const v1Len = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z)
        if (v1Len > 0) {
          v1x /= v1Len
          v1y /= v1Len
          v1z /= v1Len
        }
        
        const v2x = ny * v1z - nz * v1y
        const v2y = nz * v1x - nx * v1z
        const v2z = nx * v1y - ny * v1x
        
        // Position actuelle avec rotation appliquée
        const currentAngle = data.initialAngle + rotationAngle
        const currentZ = (v1z * Math.cos(currentAngle) + v2z * Math.sin(currentAngle)) * data.radius
        
        // Seuil pour déterminer si l'élément est derrière la planète
        const threshold = -planetRadius * 0.2
        
        // Garder l'opacité à 1 pour des couleurs vives
        if (currentZ > threshold) {
          item.style.zIndex = '5'
          item.style.opacity = '1'
        } else {
          item.style.zIndex = '15'
          item.style.opacity = '1'
        }
        
        // Appliquer la rotation inverse pour que les logos restent COMPLÈTEMENT FIXES et droits
        // Les logos ne doivent PAS tourner sur eux-mêmes, ils doivent juste suivre l'orbite
        const axes = rotationAxes[data.rotationIndex] || rotationAxes[0]
        const inverseAngle = -rotationAngleDeg
        
        // Pour rotate3d(x, y, z, angle), on doit appliquer rotate3d(-x, -y, -z, -angle)
        // Cela annule complètement la rotation du conteneur pour que les logos restent fixes
        skillElement.style.transform = `rotate3d(${-axes.x}, ${-axes.y}, ${-axes.z}, ${inverseAngle}deg)`
        skillElement.style.transformOrigin = "center center"
        skillElement.style.willChange = "transform"
      })
    }

    // Mettre à jour le z-index avec requestAnimationFrame
    let animationFrame
    const animate = () => {
      updateZIndexAndRotation()
      animationFrame = requestAnimationFrame(animate)
    }
    animate()
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
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
            
            const categoryIndex = groupedSkills.findIndex(g => g.category === group.category)
            const planetClass = `planet planet-${categoryIndex}`
            
            return (
              <div key={group.category} className="planet-wrapper">
                <div
                  className={planetClass}
                  style={{ '--planet-color': color }}
                >
                  <div className="planet-core">
                    <span className="planet-label">{group.category}</span>
                  </div>
                  
                  <div 
                    className={`orbit-container orbit-rotation-${groupedSkills.findIndex(g => g.category === group.category)}`}
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
