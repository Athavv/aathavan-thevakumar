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

    // Configuration des étoiles
    const stars = []
    const starCount = 200

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        // On ne stocke plus le Y qui bouge, mais une position de base fixe (0 à 1)
        baseYRatio: Math.random(), 
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        currentOpacity: Math.random() * 0.5 + 0.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        // Facteur de parallaxe
        parallaxFactor: (Math.random() * 0.2) + 0.05 
      })
    }

    const animate = () => {
      // 1. Nettoyer le canvas pour voir le dégradé CSS derrière
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const scrollY = window.scrollY
      const height = canvas.height

      stars.forEach((star) => {
        // --- LOGIQUE DE BOUCLE INFINIE ---
        // On calcule la position Y basée sur le ratio (0-1) * hauteur
        // On ajoute le scroll multiplié par le facteur
        let rawY = (star.baseYRatio * height) + (scrollY * star.parallaxFactor)
        
        // LE SECRET EST ICI : Le modulo (%) fait boucler l'étoile
        // Si rawY dépasse 1000px, il revient à 0 automatiquement
        let y = rawY % height
        
        // Calcul du scintillement
        star.currentOpacity += star.twinkleSpeed * star.direction
        if (star.currentOpacity >= 1 || star.currentOpacity <= 0.3) {
          star.direction *= -1
        }

        // Dessin
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
      // Recalculer les X pour remplir la nouvelle largeur
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ 
        // Votre dégradé CSS est préservé et visible grâce au clearRect
        background: "linear-gradient(to bottom, #0a0e27 0%, #0f0f1e 100%)" 
      }}
    />
  )
}

export default StarField