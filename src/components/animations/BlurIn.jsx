import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"

function BlurIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, delay, ease: "power3.out" }
      )
    }
  }, [delay])

  return <div ref={ref} className={className}>{children}</div>
}

export default BlurIn