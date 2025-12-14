import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../../style/_hero.css";

function Hero() {
  const author = "Aathavan Thevakumar";
  const [firstName, lastName] = author.split(" ");
  
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Animation subtile sur le nom - effet de brillance/glow blanc
    gsap.to([firstNameRef.current, lastNameRef.current], {
      textShadow: "0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.3)",
      duration: 3,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });

    // Animation loop pour "Développeur Full Stack"
    const letters = subtitleRef.current.querySelectorAll('.letter');
    
    gsap.to(letters, {
      y: -15,
      opacity: 0.6,
      stagger: 0.1,
      duration: 0.6,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });

  }, []);

  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="letter">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <div className="hero-content-wrapper">
          {/* Nom et Prénom avec effet d'ombre */}
          <div className="hero-title-wrapper">
            {/* Ombre en arrière-plan */}
            <div className="hero-title-shadow">
              <h1 className="hero-title">
                {firstName}
              </h1>
              <h1 className="hero-title">
                {lastName}
              </h1>
            </div>

            {/* Nom principal */}
            <div>
              <h1 ref={firstNameRef} className="hero-title hero-title-main">
                {firstName}
              </h1>
              <h1 ref={lastNameRef} className="hero-title hero-title-main">
                {lastName}
              </h1>
            </div>
          </div>

          {/* Développeur Full Stack */}
          <h3 ref={subtitleRef} className="hero-subtitle">
            {splitText('Développeur Full Stack')}
          </h3>
        </div>
      </div>
    </section>
  );
}

export default Hero;