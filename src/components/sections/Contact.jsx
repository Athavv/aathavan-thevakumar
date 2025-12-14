import React from "react"
import BlurIn from "../animations/BlurIn"
import "../../style/_contact.css"

function Contact() {
  return (
    <section 
      id="contact" 
      className="relative w-full bg-black px-[clamp(20px,5vw,60px)]"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: '200px'
      }}
    >
      <div className="max-w-[1100px] mx-auto w-full" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '120px'
      }}>
        
        <BlurIn delay={0.2}>
          <h2 className="section-title text-5xl md:text-6xl font-title text-white text-left">
            Contact me
          </h2>
        </BlurIn>

        <BlurIn delay={0.4}>
          <div className="infos-contact">
            
            {/* Email à gauche */}
            <a
              href="mailto:aathavanthevakumar@gmail.com"
              id="mail"
            >
              aathavanthevakumar@gmail.com
            </a>

            {/* Icônes à droite */}
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/aathavanthevakumar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <img 
                    src="/logos/linkedin.svg" 
                    alt="LinkedIn"
                  />
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/Athavv"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <img 
                    src="/logos/github.svg" 
                    alt="GitHub"
                  />
                </a>
              </li>
            </ul>
          </div>
        </BlurIn>
        
      </div>
    </section>
  )
}

export default Contact