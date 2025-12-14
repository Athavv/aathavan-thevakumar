import React from "react";
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf"; 

function AboutMe() {
  return (
    <section
      id="about"
      className="about-me-section relative w-full bg-black px-[clamp(20px,5vw,60px)] py-20"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="max-w-[1100px] mx-auto">
        
        <h2 className="section-title text-5xl md:text-6xl font-title text-white mb-16 text-left">
          About me
        </h2>

        <div className="about-container" style={{ marginTop: '50px', marginBottom: '100px' }}>
          
          {/* COLONNE IMAGE (Gauche) */}
          <div className="about-col image-col">
            <div className="photo-wrapper"> 
              <img
                src={aathavanPhoto}
                alt="Aathavan Thevakumar"
                className="photo-img" 
              />
            </div>
          </div>

          {/* COLONNE TEXTE (Droite) */}
          <div className="about-col text-col">
            
            <p className="text-white text-lg leading-relaxed mb-12 text-desc">
              Bienvenue sur mon Portfolio ! <br />
              <br />
              Je suis un développeur fullstack, actuellement en alternance chez{" "}
              <a
                href="https://xelians.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline hover:text-purple-400 transition-colors font-bold"
              >
                Xelians
              </a>{" "}
              dans le cadre de ma troisième année de BUT MMI (Métiers du Multimédia et de
              l'Internet). <br />
              <br />
              Dans ce portfolio vous allez pouvoir retrouver certains projets que j'ai réalisés,
              que ce soit dans le cadre de mes études ou durant mon temps libre.
            </p>

            {/* --- TIMELINE INTÉGRÉE ICI --- */}
            <div className="timeline-section mb-12">
              <h3 className="parcours text-3xl font-bold text-white mb-8">Mon parcours</h3>
              
              <div className="timeline">
                
                {/* ITEM 1 : IUT */}
                <div className="timeline-item">
                  <div className="timeline-dot current"></div>
                  <div className="timeline-content">
                    <h4 className="school">IUT DE MARNE LA VALLÉE</h4>
                    <span className="location text-gray-400 block mb-1">Site de Meaux</span>
                    <p className="degree">BUT Métiers du Multimédia et de l'Internet</p>
                  </div>
                  <div className="timeline-date">2023 - 2026</div>
                </div>

                {/* ITEM 2 : LYCÉE */}
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4 className="school">LYCÉE GERMAINE TILLION</h4>
                    <p className="degree">Baccalauréat général</p>
                    <span className="mention text-gray-400 italic block mt-1">Mention Assez Bien</span>
                  </div>
                  <div className="timeline-date">2020 - 2023</div>
                </div>

              </div>
            </div>
            {/* ----------------------------- */}

            <div className="btn-container">
              <a
                href={monCV} 
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="moon-btn">
                  Voir mon CV
                </button>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;