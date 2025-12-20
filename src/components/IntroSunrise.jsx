import React, { useLayoutEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
gsap.registerPlugin(MotionPathPlugin)

const initCursorSystem = () => {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth < 1024
  if (isTouch || isSmallScreen) return null

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

  gsap.set(cursorContainer, { left: mouseX, top: mouseY, opacity: 0, scale: 0 })
  gsap.to(cursorContainer, { opacity: 1, scale: 1, duration: 0.4 })

  let isHovering = false
  let prevX = currentX
  let prevY = currentY
  let trailLine = null

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

  const updateTrail = () => {
    if (!trailLine) {
      trailLine = document.createElement("div")
      trailLine.className = "trail-line"
      document.body.appendChild(trailLine)
    }

    const dx = currentX - prevX
    const dy = currentY - prevY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    if (distance > 0.5) {
      trailLine.style.left = `${prevX}px`
      trailLine.style.top = `${prevY}px`
      trailLine.style.width = `${distance}px`
      trailLine.style.transform = `rotate(${angle}deg)`
      trailLine.style.opacity = '1'
    }

    prevX = currentX
    prevY = currentY
  }

  let rafId = null
  const animateCursor = () => {
    currentX += (mouseX - currentX) * 0.15
    currentY += (mouseY - currentY) * 0.15
    
    cursorContainer.style.left = `${currentX}px`
    cursorContainer.style.top = `${currentY}px`

    updateTrail()
    rafId = requestAnimationFrame(animateCursor)
  }

  const throttledMouseMove = (e) => {
    requestAnimationFrame(() => handleMouseMove(e))
  }

  window.addEventListener("mousemove", throttledMouseMove, { passive: true })
  window.addEventListener("click", handleClick)
  animateCursor()

  return () => {
    window.removeEventListener("mousemove", throttledMouseMove)
    window.removeEventListener("click", handleClick)
    if (rafId) cancelAnimationFrame(rafId)
    if (cursorContainer.parentNode) {
      cursorContainer.parentNode.removeChild(cursorContainer)
    }
    if (trailLine && trailLine.parentNode) {
      trailLine.parentNode.removeChild(trailLine)
    }
    document.body.classList.remove('custom-cursor-active')
  }
}

function IntroSunrise({ onFinish }) {
  const sunRef = useRef(null)
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sun = sunRef.current
      const container = containerRef.current
      const text = textRef.current
      const letters = text?.querySelectorAll('.letter')

      if (!sun || !container || !text || !letters) return

      const isMobile = window.innerWidth < 768
      const textStartProgress = isMobile ? 0.35 : 0.4
      const textEndProgress = 0.75

      const tl = gsap.timeline({
        onComplete: () => {
          initCursorSystem()
          if (onFinish) onFinish()
        }
      })

      gsap.set(sun, { x: "-45vw", y: "40vh", opacity: 0, force3D: true })
      gsap.set(letters, { opacity: 0, y: 50, scale: 0.5, force3D: true })

      tl.to(sun, {
        duration: 2.8, 
        ease: "sine.inOut",
        opacity: 1,
        force3D: true,
        motionPath: {
          path: [
            { x: "-45vw", y: "40vh" },
            { x: "0vw", y: "-25vh" },
            { x: "45vw", y: "40vh" },
          ],
          curviness: 1.5,
        }
      })

      const textStartTime = 2.8 * textStartProgress
      const textEndTime = 2.8 * textEndProgress
      const textAnimationDuration = textEndTime - textStartTime
      
      tl.to(letters, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        stagger: {
          amount: textAnimationDuration,
          from: "start"
        },
        ease: "back.out(1.7)",
        force3D: true
      }, textStartTime)

      tl.to(sun, {
        x: "0vw",
        y: "0vh",
        duration: 0.5,
        ease: "power2.inOut",
      }, 2.8)

      tl.to(letters, {
        opacity: 0,
        scale: 0.8,
        y: -20,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.in",
        force3D: true
      }, 2.9)

      tl.to(sun, {
        width: "60px",
        height: "60px",
        boxShadow: "0 0 20px 10px rgba(255,180,50,0.4)",
        duration: 0.6,
        ease: "power2.inOut",
        force3D: true
      }, 3.3)

      tl.to(sun, { 
        y: "-35vh",
        duration: 0.3, 
        ease: "power2.out"
      }, 3.9)
      
      tl.addLabel("falling")

      tl.to(sun, { 
        y: "110vh", 
        duration: 0.5, 
        ease: "expo.in"
      }, "falling")

      tl.to(container, {
        clipPath: "inset(100% 0 0 0)", 
        duration: 0.5, 
        ease: "expo.in",
      }, "falling")

    })

    return () => {
      ctx.revert()
    }
  }, [onFinish])

  return (
    <div ref={containerRef} className="intro-container">
      <h1 ref={textRef} className="intro-text">
        {"BIENVENUE".split("").map((char, index) => (
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