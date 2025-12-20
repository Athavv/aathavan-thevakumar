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
    // Radius pour l'orbite - bien centré sur la planète avec un espacement équilibré
    // Planète: 200px (rayon = 100px), Orbite: 145px pour un espacement de ~45px
    const radius = 145
    const planetRadius = 100

    // Durées d'animation pour chaque rotation (en secondes)
    const animationDurations = [30, 35, 28, 32]
    
    // Axes de rotation pour chaque planète - chaque planète a un mouvement différent
    const rotationAxes = [
      { x: 1, y: 1, z: 0 },    // Frontend - Diagonal (fonctionne bien)
      { x: -1, y: 1, z: 0 },   // Backend - Diagonal inverse
      { x: 0, y: 1, z: 1 },    // Design - Vertical avec profondeur
      { x: 1, y: 0, z: 1 }     // Tools & DevOps - Horizontal avec profondeur
    ]
    
    // Décalages d'angle initiaux pour équilibrer les positions de chaque planète
    const angleOffsets = [
      0,      // Frontend - pas de décalage (bien réparti)
      135,    // Backend - décalage pour favoriser haut-gauche, moins bas-droite
      90,     // Design - décalage pour favoriser haut-gauche, moins bas-droite
      -90     // Tools & DevOps - décalage pour favoriser gauche, moins droite
    ]

    // Stocker les timelines GSAP pour pouvoir les nettoyer
    const timelines = []

    for (let i = 0; i < groupedSkills.length; i++) {
      const group = groupedSkills[i]
      const orbitContainer = sectionRef.current?.querySelector(`.orbit-container[data-category="${group.category}"]`)
      const orbitItems = orbitContainer?.querySelectorAll(".orbit-item")
      const axis = rotationAxes[i] || rotationAxes[0]
      const duration = animationDurations[i] || 30
      
      if (orbitItems && orbitItems.length > 0) {
        // Créer une timeline pour ce groupe
        const masterTimeline = gsap.timeline({ repeat: -1 })
        
        const angleOffset = angleOffsets[i] || 0
        
        for (let j = 0; j < orbitItems.length; j++) {
          const item = orbitItems[j]
          const skillElement = item.querySelector(".orbit-skill")
          const angle = (360 / orbitItems.length) * j + angleOffset
          const rad = (angle * Math.PI) / 180
          
          // Calculer les positions initiales sur un cercle perpendiculaire à l'axe de rotation
          const ax = axis.x
          const ay = axis.y
          const az = axis.z
          
          // Normaliser l'axe
          const axisLen = Math.sqrt(ax * ax + ay * ay + az * az)
          if (axisLen === 0) continue
          
          const nax = ax / axisLen
          const nay = ay / axisLen
          const naz = az / axisLen
          
          // Trouver un vecteur perpendiculaire à l'axe
          let refX = 0, refY = 0, refZ = 1
          if (Math.abs(naz) > 0.9) {
            refX = 1
            refY = 0
            refZ = 0
          }
          
          // Vecteur perpendiculaire 1
          const v1x = nay * refZ - naz * refY
          const v1y = naz * refX - nax * refZ
          const v1z = nax * refY - nay * refX
          
          // Normaliser v1
          const v1Len = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z)
          if (v1Len === 0) continue
          
          const v1nx = v1x / v1Len
          const v1ny = v1y / v1Len
          const v1nz = v1z / v1Len
          
          // Vecteur perpendiculaire 2
          const v2x = nay * v1nz - naz * v1ny
          const v2y = naz * v1nx - nax * v1nz
          const v2z = nax * v1ny - nay * v1nx
          
          // Normaliser v2
          const v2Len = Math.sqrt(v2x * v2x + v2y * v2y + v2z * v2z)
          if (v2Len === 0) continue
          
          const v2nx = v2x / v2Len
          const v2ny = v2y / v2Len
          const v2nz = v2z / v2Len
          
          // Position sur le cercle perpendiculaire à l'axe
          const x = (v1nx * Math.cos(rad) + v2nx * Math.sin(rad)) * radius
          const y = (v1ny * Math.cos(rad) + v2ny * Math.sin(rad)) * radius
          const z = (v1nz * Math.cos(rad) + v2nz * Math.sin(rad)) * radius
          
          // Position initiale
          gsap.set(item, {
            x: x,
            y: y,
            z: z,
            opacity: 1,
            scale: 1,
            transformStyle: "preserve-3d",
            transformOrigin: "center center"
          })
          
          // S'assurer que le skillElement n'a aucune rotation - il restera toujours droit
          gsap.set(skillElement, {
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            transformStyle: "preserve-3d"
          })
          
          // Créer une fonction pour calculer la position à un angle donné
          const getPositionAtAngle = (angleRad) => {
            const cos = Math.cos(angleRad)
            const sin = Math.sin(angleRad)
            
            // Rotation autour de l'axe défini (formule de Rodrigues)
            const ax = axis.x
            const ay = axis.y
            const az = axis.z
            
            // Normaliser l'axe
            const axisLen = Math.sqrt(ax * ax + ay * ay + az * az)
            const nax = ax / axisLen
            const nay = ay / axisLen
            const naz = az / axisLen
            
            const c = cos
            const s = sin
            const t = 1 - c
            
            const newX = (t * nax * nax + c) * x + (t * nax * nay - s * naz) * y + (t * nax * naz + s * nay) * z
            const newY = (t * nax * nay + s * naz) * x + (t * nay * nay + c) * y + (t * nay * naz - s * nax) * z
            const newZ = (t * nax * naz - s * nay) * x + (t * nay * naz + s * nax) * y + (t * naz * naz + c) * z
            
            return { x: newX, y: newY, z: newZ }
          }
          
          // Créer une animation qui met à jour uniquement la position (pas de rotation)
          const itemTimeline = gsap.timeline({ repeat: -1 })
          
          // Utiliser un objet pour stocker les valeurs
          const rotationObj = { angle: 0 }
          
          itemTimeline.to(rotationObj, {
            angle: 360,
            duration: duration,
            ease: "none",
            onUpdate: function() {
              const angleRad = (rotationObj.angle * Math.PI) / 180
              const pos = getPositionAtAngle(angleRad)
              
              // Mettre à jour uniquement la position - pas de rotation sur l'item
              gsap.set(item, {
                x: pos.x,
                y: pos.y,
                z: pos.z
              })
              
              // Le skillElement reste toujours droit (pas de rotation appliquée)
              // Il garde sa rotation initiale de 0,0,0
              
              // Mettre à jour le z-index
              const threshold = -planetRadius * 0.2
              if (pos.z > threshold) {
                item.style.zIndex = '5'
              } else {
                item.style.zIndex = '15'
              }
            }
          })
          
          masterTimeline.add(itemTimeline, 0)
        }
        
        timelines.push(masterTimeline)
      }
    }
    
    return () => {
      // Nettoyer les timelines
      timelines.forEach(timeline => timeline.kill())
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
