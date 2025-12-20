import React, { useEffect, useRef, useMemo } from "react"
import { gsap } from "gsap"
import "../../style/_hero.css"

const SUBTITLE_TEXT = 'Developpeur Full Stack'

const splitText = (text) => {
  return text.split('').map((char, i) => (
    <span key={i} className="letter">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

function Hero() {
  const author = "Aathavan Thevakumar"
  const [firstName, lastName] = useMemo(() => author.split(" "), [])
  
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const subtitleRef = useRef(null)
  const shadowRef = useRef(null)

  useEffect(() => {
    if (!firstNameRef.current || !lastNameRef.current || !subtitleRef.current) return
    
    const shadowElements = shadowRef.current?.querySelectorAll('.hero-title') || []
    shadowElements.forEach(el => {
      gsap.set(el, { opacity: 0 })
    })
    
    gsap.set([firstNameRef.current, lastNameRef.current], {
      opacity: 0,
      y: 30,
      willChange: "transform, opacity"
    })
    
    gsap.to([firstNameRef.current, lastNameRef.current], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.15,
      onComplete: () => {
        shadowElements.forEach(el => {
          gsap.to(el, { opacity: 0.4, duration: 0.3 })
        })
        
        gsap.to([firstNameRef.current, lastNameRef.current], {
          y: -2,
          duration: 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          force3D: true,
          immediateRender: false
        })
      }
    })

    const letters = subtitleRef.current.querySelectorAll('.letter')
    
    gsap.set(letters, { opacity: 0, y: 20 })
    
    gsap.to(letters, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 0.5
    })

    gsap.to(letters, {
      y: -8,
      stagger: {
        amount: 1.5,
        from: "random"
      },
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    })
  }, [])

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <div className="hero-content-wrapper">
          <div className="hero-title-wrapper">
            <div ref={shadowRef} className="hero-title-shadow">
              <h1 className="hero-title">{firstName}</h1>
              <h1 className="hero-title">{lastName}</h1>
            </div>
            <div>
              <h1 ref={firstNameRef} className="hero-title hero-title-main">
                {firstName}
              </h1>
              <h1 ref={lastNameRef} className="hero-title hero-title-main">
                {lastName}
              </h1>
            </div>
          </div>
          <h3 ref={subtitleRef} className="hero-subtitle">
            {splitText(SUBTITLE_TEXT)}
          </h3>
        </div>
      </div>
    </section>
  )
}

export default Hero