import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)

function IntroSunrise({ onFinish }) {
  const sunRef = useRef(null)
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const sun = sunRef.current
    const container = containerRef.current
    const text = textRef.current

    if (!sun || !container || !text) return

    const tl = gsap.timeline()

    // Position initiale : bas gauche
    gsap.set(sun, { x: "-45vw", y: "40vh", opacity: 0 })
    
    // Séparer les lettres pour l'animation
    const letters = text.querySelectorAll('.letter')
    gsap.set(letters, { opacity: 0, y: 50, scale: 0.5 })

    // Animation du soleil en arc simple : bas gauche -> haut milieu -> bas droite (ACCÉLÉRÉE)
    tl.to(sun, {
      duration: 3,
      ease: "sine.inOut",
      opacity: 1,
      motionPath: {
        path: [
          { x: "-45vw", y: "40vh" },    // bas gauche
          { x: "0vw", y: "-25vh" },     // haut milieu — apex
          { x: "45vw", y: "40vh" },     // bas droite
        ],
        curviness: 1.5,
      },
      onUpdate: function() {
        // Révéler les lettres progressivement au passage du soleil
        const progress = this.progress()
        if (progress >= 0.375 && progress <= 0.625) {
          const letterProgress = (progress - 0.375) / 0.25
          const lettersToShow = Math.floor(letterProgress * letters.length)
          
          letters.forEach((letter, index) => {
            if (index <= lettersToShow) {
              gsap.to(letter, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)",
              })
            }
          })
        }
      }
    })

    // Le soleil revient vers le centre pour "taper" le texte
    tl.to(sun, {
      x: "0vw",
      y: "0vh",
      duration: 0.6,
      ease: "power2.inOut",
    }, 3)

    // Au moment de l'impact, les lettres explosent
    tl.to(letters, {
      opacity: 0,
      y: (index) => -100 - Math.random() * 100,
      x: (index) => (Math.random() - 0.5) * 200,
      rotation: (index) => (Math.random() - 0.5) * 360,
      scale: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: "power2.out",
    }, 3.6)

    // Réduire le soleil après l'impact
    tl.to(sun, {
      width: "60px",
      height: "60px",
      boxShadow: "0 0 20px 10px rgba(255,180,50,0.4)",
      duration: 0.8,
      ease: "power2.inOut",
    }, 3.6)

    // Faire rebondir le soleil AU MILIEU seulement
    tl.to(sun, {
      y: "-20vh",
      duration: 0.4,
      ease: "power2.out",
    }, 4.4)

    // Le soleil revient au centre
    tl.to(sun, {
      y: "0vh",
      duration: 0.4,
      ease: "bounce.out",
    }, 4.8)
    
    tl.to(container, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        // Transformer le soleil en curseur
        transformSunToCursor()
        onFinish()
      },
    }, 5.2)

    // Fonction pour transformer le soleil en curseur avec trainée
    const transformSunToCursor = () => {
      setTimeout(() => {
        if (!sun) return

        // Cacher le curseur par défaut
        document.body.style.cursor = "none"

        // Créer un conteneur pour le soleil-curseur
        const cursorContainer = document.createElement("div")
        cursorContainer.className = "sun-cursor"
        cursorContainer.style.cssText = `
          position: fixed;
          width: 60px;
          height: 60px;
          pointer-events: none;
          z-index: 9999;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease-out;
        `

        // Réinitialiser le style du soleil
        sun.style.cssText = `
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff4a3, #ffdd55, #ff9900);
          box-shadow: 0 0 20px 10px rgba(255,180,50,0.4);
          position: absolute;
          pointer-events: none;
          left: 0;
          top: 0;
          transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        `

        // Ajouter au body
        document.body.appendChild(cursorContainer)
        cursorContainer.appendChild(sun)

        // Tableau pour stocker les rayons de trainée
        const trailRays = []

        // Fonction pour créer un rayon de trainée lisse et lumineux
        const createTrailRay = (x, y) => {
          const ray = document.createElement("div")
          ray.style.cssText = `
            position: fixed;
            width: 60px;
            height: 3px;
            border-radius: 2px;
            background: linear-gradient(90deg, 
              rgba(255, 244, 163, 0) 0%, 
              rgba(255, 221, 85, 0.9) 50%, 
              rgba(255, 244, 163, 0) 100%);
            box-shadow: 0 0 8px rgba(255, 221, 85, 1), 0 0 15px rgba(255, 180, 50, 0.8);
            pointer-events: none;
            z-index: 9998;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
          `
          document.body.appendChild(ray)

          // Animer la disparition du rayon
          gsap.to(ray, {
            opacity: 0,
            scaleX: 0.3,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              ray.remove()
            }
          })

          trailRays.push(ray)
        }

        // Variables pour le mouvement fluide
        let mouseX = window.innerWidth / 2
        let mouseY = window.innerHeight / 2
        let currentX = mouseX
        let currentY = mouseY
        let frameCount = 0
        let lastX = currentX
        let lastY = currentY
        let isHovering = false

        // Suivre la souris avec animation fluide
        const handleMouseMove = (e) => {
          mouseX = e.clientX
          mouseY = e.clientY

          // Vérifier si on survole un élément cliquable
          const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)
          const isClickable = elementUnderCursor && (
            elementUnderCursor.tagName === 'BUTTON' ||
            elementUnderCursor.tagName === 'A' ||
            elementUnderCursor.onclick ||
            elementUnderCursor.style.cursor === 'pointer' ||
            window.getComputedStyle(elementUnderCursor).cursor === 'pointer'
          )

          if (isClickable && !isHovering) {
            isHovering = true
            // Réduire la taille sur hover
            gsap.to(sun, {
              scale: 0.6,
              duration: 0.3,
              ease: "power2.out",
            })
          } else if (!isClickable && isHovering) {
            isHovering = false
            // Retour à la normale
            gsap.to(sun, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            })
          }
        }

        // Effet de clic
        const handleClick = () => {
          if (isHovering) {
            // Animation de "punch" au clic
            gsap.to(sun, {
              scale: 0.6,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            })
          }
        }

        // Animation loop pour le mouvement fluide et la trainée
        const animateCursor = () => {
          // Interpolation pour un mouvement fluide
          currentX += (mouseX - currentX) * 0.15
          currentY += (mouseY - currentY) * 0.15

          cursorContainer.style.left = `${currentX}px`
          cursorContainer.style.top = `${currentY}px`

          // Calculer la vitesse de déplacement
          const deltaX = currentX - lastX
          const deltaY = currentY - lastY
          const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

          // Créer des rayons si la souris bouge
          if (speed > 0.5) {
            frameCount++
            if (frameCount % 3 === 0) {
              createTrailRay(currentX, currentY)
            }
          }

          lastX = currentX
          lastY = currentY

          requestAnimationFrame(animateCursor)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("click", handleClick)
        animateCursor()
      }, 500)
    }

  }, [onFinish])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 w-screen h-screen flex items-center justify-center"
    >
      {/* Soleil - DEVANT le texte (z-index plus élevé) */}
      <div
        ref={sunRef}
        className="rounded-full flex-shrink-0"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, #fff4a3, #ffdd55, #ff9900)",
          boxShadow: "0 0 150px 80px rgba(255,180,50,0.6)",
          opacity: 0,
          zIndex: 30,
          position: "absolute",
          pointerEvents: "none",
        }}
      ></div>

      {/* Texte - DERRIÈRE le soleil (z-index plus bas) */}
      <h1
        ref={textRef}
        className="absolute text-white font-bold tracking-wide text-center"
        style={{
          fontSize: "120px",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {"Bienvenue".split("").map((char, index) => (
          <span
            key={index}
            className="letter inline-block"
            style={{
              display: "inline-block",
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default IntroSunrise