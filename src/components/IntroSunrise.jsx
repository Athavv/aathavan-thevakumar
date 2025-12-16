import React, { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)

function IntroSunrise({ onFinish }) {
  const sunRef = useRef(null)
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sun = sunRef.current
      const container = containerRef.current
      const text = textRef.current
      const letters = text.querySelectorAll('.letter')

      if (!sun || !container || !text) return

      const tl = gsap.timeline({
        onComplete: () => {
          initCursorSystem()
          if (onFinish) onFinish()
        }
      })

      // SETUP
      gsap.set(sun, { x: "-45vw", y: "40vh", opacity: 0 })
      gsap.set(letters, { opacity: 0, y: 50, scale: 0.5 })

      // 1. ARC DU SOLEIL (2.2s)
      tl.to(sun, {
        duration: 2.2, 
        ease: "sine.inOut",
        opacity: 1,
        motionPath: {
          path: [
            { x: "-45vw", y: "40vh" },
            { x: "0vw", y: "-25vh" }, // Sommet
            { x: "45vw", y: "40vh" },
          ],
          curviness: 1.5,
        },
        onUpdate: function() {
          const progress = this.progress()
          // APPARITION TEXTE : TÔT (dès 25% du trajet)
          if (progress >= 0.25 && progress <= 0.7) {
            const letterProgress = (progress - 0.25) / 0.35
            const lettersToShow = Math.floor(letterProgress * letters.length)
            
            letters.forEach((letter, index) => {
              if (index <= lettersToShow) {
                gsap.to(letter, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.3, 
                  ease: "back.out(1.7)",
                  overwrite: "auto"
                })
              }
            })
          }
        }
      })

      // 2. RETOUR AU CENTRE (Impact) - Rapide (0.5s)
      tl.to(sun, {
        x: "0vw",
        y: "0vh",
        duration: 0.5,
        ease: "power2.inOut",
      }, 2.2)

      // 3. EXPLOSION LETTRES (0.5s)
      tl.to(letters, {
        opacity: 0,
        y: (index) => -100 - Math.random() * 100,
        x: (index) => (Math.random() - 0.5) * 200,
        rotation: (index) => (Math.random() - 0.5) * 360,
        scale: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.out",
      }, 2.7)

      // 4. RÉTRÉCISSEMENT (0.6s)
      tl.to(sun, {
        width: "60px",
        height: "60px",
        boxShadow: "0 0 20px 10px rgba(255,180,50,0.4)",
        duration: 0.6,
        ease: "power2.inOut",
      }, 2.7)

      // 5. LE SAUT (Hop !) - 0.4s (Vif)
      tl.to(sun, { 
        y: "-35vh", // Saute bien haut
        duration: 0.4, 
        ease: "power2.out" // Ralentit en montant
      }, 3.3)
      
      // 6. LA CHUTE & LE RIDEAU - 0.8s (Lourd et rapide)
      tl.addLabel("falling")

      // A. Le soleil tombe
      tl.to(sun, { 
        y: "110vh", 
        duration: 0.8, 
        ease: "expo.in" // Accélère fort vers la fin (gravité)
      }, "falling")

      // B. Le RIDEAU NOIR disparaît du haut vers le bas
      // clipPath: inset(top right bottom left) -> On met top à 100%
      tl.to(container, {
        clipPath: "inset(100% 0 0 0)", 
        duration: 0.8, 
        ease: "expo.in", // Parfaitement synchro avec le soleil
      }, "falling")

    })

    // --- LOGIQUE CURSEUR (inchangée, s'active à la fin) ---
    const initCursorSystem = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 1024
      if (isTouch || isSmallScreen) return 

      document.body.classList.add('custom-cursor-active')

      const cursorContainer = document.createElement("div")
      cursorContainer.className = "sun-cursor"
      
      const cursorVisual = document.createElement("div")
      cursorVisual.className = "sun-cursor-visual"
      
      cursorContainer.appendChild(cursorVisual)
      document.body.appendChild(cursorContainer)

      let mouseX = window.innerWidth / 2
      let mouseY = window.innerHeight / 2
      let currentX = mouseX
      let currentY = mouseY 

      // Fade in propre du curseur
      gsap.set(cursorContainer, { left: mouseX, top: mouseY, opacity: 0, scale: 0 })
      gsap.to(cursorContainer, { opacity: 1, scale: 1, duration: 0.4 })

      let frameCount = 0
      let isHovering = false

      const handleMouseMove = (e) => {
        mouseX = e.clientX
        mouseY = e.clientY

        const element = document.elementFromPoint(e.clientX, e.clientY)
        const isClickable = element && (
            element.tagName === 'BUTTON' || 
            element.tagName === 'A' || 
            element.onclick || 
            window.getComputedStyle(element).cursor === 'pointer'
        )

        if (isClickable && !isHovering) {
            isHovering = true
            gsap.to(cursorVisual, { scale: 0.6, duration: 0.2 })
        } else if (!isClickable && isHovering) {
            isHovering = false
            gsap.to(cursorVisual, { scale: 1, duration: 0.2 })
        }
      }

      const handleClick = () => {
        if (isHovering) {
             gsap.to(cursorVisual, { scale: 0.4, duration: 0.1, yoyo: true, repeat: 1 })
        }
      }

      const animateCursor = () => {
        currentX += (mouseX - currentX) * 0.15
        currentY += (mouseY - currentY) * 0.15
        
        cursorContainer.style.left = `${currentX}px`
        cursorContainer.style.top = `${currentY}px`

        const speed = Math.abs(mouseX - currentX) + Math.abs(mouseY - currentY)
        if (speed > 2) {
            frameCount++
            if (frameCount % 4 === 0) createTrail(currentX, currentY)
        }
        requestAnimationFrame(animateCursor)
      }

      const createTrail = (x, y) => {
        const ray = document.createElement("div")
        ray.className = "trail-ray"
        ray.style.left = `${x}px`
        ray.style.top = `${y}px`
        document.body.appendChild(ray)
        gsap.to(ray, {
            opacity: 0,
            scaleX: 0.2,
            duration: 0.4,
            onComplete: () => ray.remove()
        })
      }

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("click", handleClick)
      animateCursor()
    }

    return () => ctx.revert()
  }, [onFinish])

  return (
    <div ref={containerRef} className="intro-container">
      <h1 ref={textRef} className="intro-text">
        {"Bienvenue".split("").map((char, index) => (
          <span key={index} className="letter">
            {char}
          </span>
        ))}
      </h1>
      <div ref={sunRef} className="intro-sun"></div>
    </div>
  )
}

export default IntroSunrise