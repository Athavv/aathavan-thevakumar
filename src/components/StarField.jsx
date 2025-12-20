import React, { useEffect, useRef } from "react"

function StarField() {
  const canvasRef = useRef(null)
  const isVisibleRef = useRef(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    let animationFrameId = null

    let dpr = window.devicePixelRatio || 1

    const drawBackground = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#0a0e27')
      gradient.addColorStop(1, '#0f0f1e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      drawBackground()
    }
    resizeCanvas()

    const stars = []
    const starCount = 150
    const initialWidth = window.innerWidth

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * initialWidth,
        baseYRatio: Math.random(),
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        currentOpacity: Math.random() * 0.5 + 0.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        parallaxFactor: (Math.random() * 0.2) + 0.05
      })
    }

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      const scrollY = window.scrollY
      const hasScrolled = Math.abs(scrollY - lastScrollYRef.current) >= 1
      lastScrollYRef.current = scrollY

      drawBackground()
      const height = window.innerHeight

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        let rawY = (star.baseYRatio * height) + (scrollY * star.parallaxFactor)
        let y = rawY % height
        if (y < 0) y += height

        star.currentOpacity += star.twinkleSpeed * star.direction
        if (star.currentOpacity >= 1 || star.currentOpacity <= 0.3) {
          star.direction *= -1
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`
        ctx.beginPath()
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
    }

    const handleResize = () => {
      resizeCanvas()
      for (let i = 0; i < stars.length; i++) {
        stars[i].x = Math.random() * window.innerWidth
      }
      drawBackground()
      const height = window.innerHeight
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        const y = star.baseYRatio * height
        ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`
        ctx.beginPath()
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    isVisibleRef.current = !document.hidden
    drawBackground()
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i]
      const height = window.innerHeight
      const y = star.baseYRatio * height
      star.currentOpacity += star.twinkleSpeed * star.direction
      if (star.currentOpacity >= 1 || star.currentOpacity <= 0.3) {
        star.direction *= -1
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`
      ctx.beginPath()
      ctx.arc(star.x, y, star.radius, 0, Math.PI * 2)
      ctx.fill()
    }
    animate()

    window.addEventListener("resize", handleResize, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="star-field" />
}

export default StarField