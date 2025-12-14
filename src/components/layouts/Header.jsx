import React, { useState, useEffect } from "react"

function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header className={`header-pill ${isVisible ? 'header-visible' : 'header-hidden'}`}>
      <a href="#hero" className="header-link">
        Home
      </a>
      <a href="#projects" className="header-link">
        Project
      </a>
      <a href="#about" className="header-link">
        About me
      </a>
            <a href="#experience" className="header-link">
        Experiences
      </a>
      <a href="#contact" className="header-link">
        Contact
      </a>
    </header>
  )
}

export default Header