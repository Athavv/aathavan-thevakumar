import React, { useEffect, useRef } from "react"

function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    let animationFrameId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const stars = []
    const starCount = 200

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
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
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scrollY = window.scrollY
      const height = canvas.height

      stars.forEach((star) => {
        let rawY = (star.baseYRatio * height) + (scrollY * star.parallaxFactor)
        let y = rawY % height

        star.currentOpacity += star.twinkleSpeed * star.direction
        if (star.currentOpacity >= 1 || star.currentOpacity <= 0.3) {
          star.direction *= -1
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`
        ctx.beginPath()
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
      stars.forEach((star) => {
        star.x = Math.random() * canvas.width
      })
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="star-field" />
}

export default StarField