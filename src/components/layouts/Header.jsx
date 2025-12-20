import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useThrottle } from "../../hooks/useThrottle"
import { NAV_LINKS } from "../../utils/constants"

const NavLink = React.memo(({ href, label, className, onClick }) => (
  <a href={href} onClick={onClick} className={className}>
    {label}
  </a>
))

NavLink.displayName = 'NavLink'

function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const lastScrollY = lastScrollYRef.current
    
    if (currentScrollY < lastScrollY) {
      setIsVisible(true)
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false)
    }
    lastScrollYRef.current = currentScrollY
  }, [])

  const throttledHandleScroll = useThrottle(handleScroll, 100)

  useEffect(() => {
    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [throttledHandleScroll])

  const handleLinkClick = useCallback((e, href) => {
    e.preventDefault()
    setIsMenuOpen(false)
    
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location.pathname, navigate])

  const navLinks = useMemo(() => {
    return NAV_LINKS.map(({ href, label }) => ({
      href,
      label,
      onClick: (e) => handleLinkClick(e, href)
    }))
  }, [handleLinkClick])

  return (
    <>
      <header className={`header-pill ${isVisible ? 'header-visible' : 'header-hidden'}`}>
        <div className="header-desktop">
          {navLinks.map(({ href, label, onClick }) => (
            <NavLink key={href} href={href} label={label} className="header-link" onClick={onClick} />
          ))}
        </div>
        <button 
          className={`header-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      
      <div className={`header-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {navLinks.map(({ href, label, onClick }) => (
            <NavLink key={href} href={href} label={label} className="mobile-link" onClick={onClick} />
          ))}
        </nav>
      </div>
    </>
  )
}

export default Header